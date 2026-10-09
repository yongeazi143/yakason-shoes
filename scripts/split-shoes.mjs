import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dequantize, prune } from '@gltf-transform/functions';

const [, , inPath, outPath] = process.argv;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read(inPath);
await doc.transform(dequantize());
const scene = doc.getRoot().listScenes()[0];
const buffer = doc.getRoot().listBuffers()[0];

// 1. Collect every triangle primitive with positions baked to world space
const pieces = [];
scene.traverse((node) => {
    const mesh = node.getMesh();
    if (!mesh) return;
    const m = node.getWorldMatrix();
    for (const prim of mesh.listPrimitives()) {
        if (prim.getMode() !== 4) continue;
        const pos = prim.getAttribute('POSITION');
        const n = pos.getCount();
        const P = new Float32Array(n * 3);
        const v = [0, 0, 0];
        for (let i = 0; i < n; i++) {
            pos.getElement(i, v);
            P[i * 3] = m[0] * v[0] + m[4] * v[1] + m[8] * v[2] + m[12];
            P[i * 3 + 1] = m[1] * v[0] + m[5] * v[1] + m[9] * v[2] + m[13];
            P[i * 3 + 2] = m[2] * v[0] + m[6] * v[1] + m[10] * v[2] + m[14];
        }
        const idx = prim.getIndices();
        const I = idx ? Uint32Array.from(idx.getArray()) : Uint32Array.from({ length: n }, (_, i) => i);
        pieces.push({ prim, m, P, I, n });
    }
});

// 2. Split each primitive into connected components
const comps = [];
for (const pc of pieces) {
    const parent = Int32Array.from({ length: pc.n }, (_, i) => i);
    const find = (a) => { while (parent[a] !== a) { parent[a] = parent[parent[a]]; a = parent[a]; } return a; };
    for (let t = 0; t < pc.I.length; t += 3) {
        const a = find(pc.I[t]);
        for (let k = 1; k < 3; k++) { const b = find(pc.I[t + k]); if (b !== a) parent[b] = a; }
    }
    const map = new Map();
    for (let t = 0; t < pc.I.length; t += 3) {
        const r = find(pc.I[t]);
        let c = map.get(r);
        if (!c) { c = { pc, tris: [], s: [0, 0, 0], cnt: 0, g: 0 }; map.set(r, c); comps.push(c); }
        c.tris.push(t);
        for (let k = 0; k < 3; k++) {
            const vi = pc.I[t + k];
            c.s[0] += pc.P[vi * 3]; c.s[1] += pc.P[vi * 3 + 1]; c.s[2] += pc.P[vi * 3 + 2]; c.cnt++;
        }
    }
}
console.log(`Found ${comps.length} connected pieces`);

// 3. Two-means clustering on piece centroids (weighted by triangle count)
const cen = (c) => [c.s[0] / c.cnt, c.s[1] / c.cnt, c.s[2] / c.cnt];
const d2 = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
const big = comps.reduce((a, b) => (b.tris.length > a.tris.length ? b : a));
let c1 = cen(big);
let c2 = comps.map(cen).reduce((a, b) => (d2(b, c1) > d2(a, c1) ? b : a));
for (let it = 0; it < 30; it++) {
    const acc = [[0, 0, 0, 0], [0, 0, 0, 0]];
    for (const c of comps) {
        const p = cen(c);
        c.g = d2(p, c1) <= d2(p, c2) ? 0 : 1;
        const w = c.tris.length;
        acc[c.g][0] += p[0] * w; acc[c.g][1] += p[1] * w; acc[c.g][2] += p[2] * w; acc[c.g][3] += w;
    }
    if (!acc[0][3] || !acc[1][3]) break;
    c1 = acc[0].slice(0, 3).map((x) => x / acc[0][3]);
    c2 = acc[1].slice(0, 3).map((x) => x / acc[1][3]);
}

// 4. Per-group triangles and bounding boxes
const groups = [0, 1].map((g) => {
    const byPiece = new Map();
    const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
    for (const c of comps.filter((c) => c.g === g)) {
        if (!byPiece.has(c.pc)) byPiece.set(c.pc, []);
        byPiece.get(c.pc).push(...c.tris);
        for (const t of c.tris) for (let k = 0; k < 3; k++) {
            const vi = c.pc.I[t + k];
            for (let a = 0; a < 3; a++) {
                const val = c.pc.P[vi * 3 + a];
                if (val < min[a]) min[a] = val;
                if (val > max[a]) max[a] = val;
            }
        }
    }
    const size = max.map((v, i) => v - min[i]);
    const center = max.map((v, i) => (v + min[i]) / 2);
    return { byPiece, size, center };
});
groups.sort((a, b) => b.size[1] - a.size[1]); // taller (upright) shoe = SHOE_A
const names = ['PAIR_A', 'PAIR_B'];
groups.forEach((g, i) => console.log(names[i], 'size', g.size.map((x) => x.toFixed(3)), 'center', g.center.map((x) => x.toFixed(3))));

// 5. Build the new meshes
scene.listChildren().forEach((c) => c.dispose());
groups.forEach((g, gi) => {
    const mesh = doc.createMesh(names[gi]);
    for (const [pc, tris] of g.byPiece) {
        const remap = new Int32Array(pc.n).fill(-1);
        const verts = [];
        const newIdx = [];
        for (const t of tris) for (let k = 0; k < 3; k++) {
            const vi = pc.I[t + k];
            if (remap[vi] < 0) { remap[vi] = verts.length; verts.push(vi); }
            newIdx.push(remap[vi]);
        }
        const prim = doc.createPrimitive().setMaterial(pc.prim.getMaterial()).setMode(4);
        prim.setIndices(doc.createAccessor().setType('SCALAR').setArray(Uint32Array.from(newIdx)).setBuffer(buffer));
        const m = pc.m;
        for (const sem of pc.prim.listSemantics()) {
            const acc = pc.prim.getAttribute(sem);
            const es = acc.getElementSize();
            const src = acc.getArray();
            const out = new src.constructor(verts.length * es);
            verts.forEach((v, k) => {
                if (sem === 'POSITION') {
                    for (let a = 0; a < 3; a++) out[k * es + a] = pc.P[v * 3 + a] - g.center[a];
                } else if (sem === 'NORMAL' || sem === 'TANGENT') {
                    const x = src[v * es], y = src[v * es + 1], z = src[v * es + 2];
                    const nx = m[0] * x + m[4] * y + m[8] * z;
                    const ny = m[1] * x + m[5] * y + m[9] * z;
                    const nz = m[2] * x + m[6] * y + m[10] * z;
                    const l = Math.hypot(nx, ny, nz) || 1;
                    out[k * es] = nx / l; out[k * es + 1] = ny / l; out[k * es + 2] = nz / l;
                    if (es === 4) out[k * es + 3] = src[v * es + 3];
                } else {
                    for (let j = 0; j < es; j++) out[k * es + j] = src[v * es + j];
                }
            });
            prim.setAttribute(sem, doc.createAccessor().setType(acc.getType()).setArray(out).setNormalized(acc.getNormalized()).setBuffer(buffer));
        }
        mesh.addPrimitive(prim);
    }
    scene.addChild(doc.createNode(names[gi]).setMesh(mesh).setTranslation(g.center));
});

await doc.transform(prune());
await io.write(outPath, doc);
console.log('Wrote', outPath);