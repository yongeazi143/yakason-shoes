'use client';

import React, { useRef, useMemo, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ==============================================================================
// HERO 3D CONFIGURATION
// Single configuration object for all 3D tuning values, scales, backdrops, lighting
// ==============================================================================
export const HERO_3D_CONFIG = {
  // Target normalized size: increased so shoes fill 90 to 95% of the viewport width
  targetSize: 5.4,

  camera: {
    fov: 38,
    position: [0, 3, 6] as [number, number, number],
  },

  // Phase R2 Dark Backdrop configuration (lower ~65% fade with minimal blur)
  backdrop: {
    coverage: '65%',
    blur: '4px',
    gradientBottom: 'rgba(26, 14, 10, 0.78)',
    gradientMid: 'rgba(26, 14, 10, 0.48)',
    gradientTop: 'rgba(26, 14, 10, 0)',
  },

  pairA: {
    // Scales: multipliers on top of normalized size (fills ~90-95% viewport width)
    scale: 1.05,
    mobileScale: 0.82,
    exitScale: 0.45,
    mobileExitScale: 0.35,

    // Initial held position: centered behind the headline, at least 90px below header
    initialPos: [-0.2, -0.28, 0.0] as [number, number, number],
    mobileInitialPos: [0.0, 0.22, 0.0] as [number, number, number],

    // Initial rotation: natural 3/4 craft presentation
    initialRot: [0.18, 0.32, -0.06] as [number, number, number],

    // Timeline 0.10 to 0.55 Exit: rotates ~70 deg (1.22 rad) on Y, travels completely off-screen up-left
    exitPos: [-10.5, 7.5, -2.5] as [number, number, number],
    mobileExitPos: [-7.5, 6.0, -2.0] as [number, number, number],
    exitRot: [0.25, 1.54, 0.12] as [number, number, number], // 0.32 + 1.22 = 1.54 rad (~70 deg delta)

    // Subtle idle float and rotational sway
    idleFloatAmp: 0.04,
    idleFloatFreq: 0.7,
    idleRotAmp: 0.035,
    idleRotFreq: 0.5,
  },

  pairB: {
    // Timeline enter: enters from fully off screen (below and right), not visible before progress ~0.10
    enterPos: [8.5, -15.0, -2.0] as [number, number, number],
    mobileEnterPos: [4.0, -12.0, -1.8] as [number, number, number],
    enterScale: 0.35,
    enterRot: [-0.15, -0.85, 0.05] as [number, number, number],

    // Timeline 0.55 to 0.90 Settled: settles large on the right/center, rotated ~-25 deg on Y
    settledPos: [0.85, -0.26, 0.0] as [number, number, number],
    mobileSettledPos: [0.0, -0.32, 0.0] as [number, number, number],
    settledScale: 1.05,
    mobileSettledScale: 0.8,
    settledRotY: -0.436, // ~ -25 deg (-0.436 rad)
    turntableSpeed: 0.32,

    // Timeline 0.90 to 1.00 Exit: fade out as hero leaves viewport
    exitPos: [0.85, -0.26, -1.0] as [number, number, number],
  },

  scroll: {
    pinStart: 'top top',
    pinEnd: '+=300%',
    anticipatePin: 1,
    scrub: 1,
    easing: 'power2.inOut',
  },

  parallax: {
    maxRotX: 0.16, // max ±0.16 rad on X
    maxRotY: 0.16, // max ±0.16 rad on Y
    maxPosX: 0.22, // max ±0.22 units on X
    maxPosY: 0.22, // max ±0.22 units on Y
    damping: 0.08, // lerp damping factor
    midMotionReduction: 0.25, // strength reduced down to 25% mid-motion so it never fights scroll
  },

  // Phase R1 Material: Black polished leather (non-chrome, non-silver)
  material: {
    color: '#0c0a09', // Force base color to stay near-black
    metalness: 0.01,   // 0 to 0.05 (non-metallic)
    roughness: 0.44,   // 0.4 to 0.5 (diffuses specular flare)
    envMapIntensity: 0.35, // 0.3 to 0.4 (subtle leather reflections)
    clearcoat: 0.3,
    clearcoatRoughness: 0.35,
  },

  // Phase R1 Lighting: Soft key, rim, and environment lighting to eliminate white reflections
  lighting: {
    exposure: 1.02,
    keyLight: {
      position: [-4.5, 5.5, 4.0] as [number, number, number],
      intensity: 1.4, // Softened key light to prevent harsh white blowout
      color: '#FFF2E0',
    },
    rimLight: {
      position: [4.5, 2.2, -3.5] as [number, number, number],
      intensity: 1.2, // Soft rim light to separate from background without specular flare
      color: '#FBF5EE',
    },
    fillLight: {
      position: [0.0, -2.5, 2.8] as [number, number, number],
      intensity: 0.45,
      color: '#E8D2B8',
    },
    envIntensity: 0.38, // ~0.4 environment intensity
    shadowColor: '#1A0E0A',
    shadowOpacity: 0.28,
  },
};

// ==============================================================================
// EASING UTILITY: Power2.inOut (quad in-out)
// ==============================================================================
function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

// Lerp helper
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// ==============================================================================
// 3D SHOES SCENE COMPONENT
// ==============================================================================
interface ShoesSceneProps {
  isDebug: boolean;
  isMobile: boolean;
  progressRef: React.MutableRefObject<number>;
  mouseParallaxRef: React.MutableRefObject<{ x: number; y: number }>;
}

function ShoesScene({
  isDebug,
  isMobile,
  progressRef,
  mouseParallaxRef,
}: ShoesSceneProps) {
  const { scene } = useGLTF('/models/shoes-split.glb');
  const pairARef = useRef<THREE.Object3D | null>(null);
  const pairBRef = useRef<THREE.Object3D | null>(null);
  const createdMaterialsRef = useRef<THREE.Material[]>([]);

  // Damped parallax tracker
  const dampedParallax = useRef({ x: 0, y: 0 });

  // Clone scene to preserve clean instance
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  // Compute bounding boxes and normalization factors
  const normFactors = useMemo(() => {
    const pairA = clonedScene.getObjectByName('PAIR_A');
    const pairB = clonedScene.getObjectByName('PAIR_B');

    if (!pairA || !pairB) {
      console.error(
        'FATAL: PAIR_A or PAIR_B not found in shoes-split.glb scene graph:',
        clonedScene
      );
      throw new Error('Failed to find PAIR_A or PAIR_B by name in shoes-split.glb');
    }

    // Reset scales for unskewed bounding box measurement
    pairA.scale.set(1, 1, 1);
    pairB.scale.set(1, 1, 1);
    pairA.updateMatrixWorld(true);
    pairB.updateMatrixWorld(true);

    const boxA = new THREE.Box3().setFromObject(pairA);
    const sizeA = new THREE.Vector3();
    boxA.getSize(sizeA);
    const maxDimA = Math.max(sizeA.x, sizeA.y, sizeA.z) || 1;
    const factorA = HERO_3D_CONFIG.targetSize / maxDimA;

    const boxB = new THREE.Box3().setFromObject(pairB);
    const sizeB = new THREE.Vector3();
    boxB.getSize(sizeB);
    const maxDimB = Math.max(sizeB.x, sizeB.y, sizeB.z) || 1;
    const factorB = HERO_3D_CONFIG.targetSize / maxDimB;

    return { factorA, factorB };
  }, [clonedScene]);

  // Setup materials: Phase R1 polished black leather (not chrome/silver)
  useEffect(() => {
    const pairA = clonedScene.getObjectByName('PAIR_A');
    const pairB = clonedScene.getObjectByName('PAIR_B');

    if (!pairA || !pairB) return;

    pairARef.current = pairA;
    pairBRef.current = pairB;

    // Clean up any previously created materials
    createdMaterialsRef.current.forEach((m) => m.dispose());
    createdMaterialsRef.current = [];

    const applyMaterial = (node: THREE.Object3D, isPairA: boolean) => {
      node.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;

          if (isDebug) {
            // ?debug=1: Flat wireframe materials
            const debugMat = new THREE.MeshBasicMaterial({
              color: isPairA ? 0x00e5ff : 0xff2a85, // Cyan for A, Magenta for B
              wireframe: true,
            });
            mesh.material = debugMat;
            createdMaterialsRef.current.push(debugMat);
          } else {
            // Phase R1: Black polished leather MeshPhysicalMaterial
            const origMat = (mesh.material as THREE.MeshStandardMaterial) || {};
            const physicalMat = new THREE.MeshPhysicalMaterial({
              color: new THREE.Color(HERO_3D_CONFIG.material.color), // Force near-black
              map: origMat.map || null,
              normalMap: origMat.normalMap || null,
              roughnessMap: origMat.roughnessMap || null,
              metalnessMap: origMat.metalnessMap || null,
              aoMap: origMat.aoMap || null,
              roughness: HERO_3D_CONFIG.material.roughness,
              metalness: HERO_3D_CONFIG.material.metalness,
              envMapIntensity: HERO_3D_CONFIG.material.envMapIntensity,
              clearcoat: HERO_3D_CONFIG.material.clearcoat,
              clearcoatRoughness: HERO_3D_CONFIG.material.clearcoatRoughness,
              transparent: true,
              opacity: 1.0,
            });
            mesh.material = physicalMat;
            createdMaterialsRef.current.push(physicalMat);
          }
        }
      });
    };

    applyMaterial(pairA, true);
    applyMaterial(pairB, false);

    return () => {
      createdMaterialsRef.current.forEach((m) => m.dispose());
      createdMaterialsRef.current = [];
    };
  }, [clonedScene, isDebug]);

  // Frame Loop: Driven by progressRef (scroll) + mouse parallax + idle
  useFrame((state) => {
    const pairA = pairARef.current;
    const pairB = pairBRef.current;
    if (!pairA || !pairB) return;

    const t = state.clock.getElapsedTime();
    const progress = Math.min(1, Math.max(0, progressRef.current));

    // --------------------------------------------------------------------------
    // 1. Visibility Management (Phase R3 Exit & Entry)
    // - PAIR_A travels completely off-screen by progress ~0.55 and stays hidden
    // - PAIR_B enters from fully off-screen below-right, not visible before ~0.10
    // --------------------------------------------------------------------------
    pairA.visible = progress < 0.55;
    pairB.visible = progress >= 0.10;

    // --------------------------------------------------------------------------
    // 2. Mouse Parallax (Damped lerp ~0.08, reduced mid-swap)
    // --------------------------------------------------------------------------
    const targetParallax = mouseParallaxRef.current;
    dampedParallax.current.x +=
      (targetParallax.x - dampedParallax.current.x) * HERO_3D_CONFIG.parallax.damping;
    dampedParallax.current.y +=
      (targetParallax.y - dampedParallax.current.y) * HERO_3D_CONFIG.parallax.damping;

    // Reduce parallax strength while swap is in mid-motion (0.10 to 0.55, peak ~0.325)
    let midFactor = 0;
    if (progress >= 0.10 && progress <= 0.55) {
      const mid = 0.325;
      const normalizedDist = Math.abs(progress - mid) / (0.55 - mid);
      midFactor = 1 - Math.min(1, Math.max(0, normalizedDist));
    }
    const parallaxStrength =
      1 - midFactor * (1 - HERO_3D_CONFIG.parallax.midMotionReduction);

    const rotOffX =
      dampedParallax.current.y * HERO_3D_CONFIG.parallax.maxRotX * parallaxStrength;
    const rotOffY =
      dampedParallax.current.x * HERO_3D_CONFIG.parallax.maxRotY * parallaxStrength;
    const posOffX =
      dampedParallax.current.x * HERO_3D_CONFIG.parallax.maxPosX * parallaxStrength;
    const posOffY =
      dampedParallax.current.y * HERO_3D_CONFIG.parallax.maxPosY * parallaxStrength;

    // --------------------------------------------------------------------------
    // 3. Base Configuration Values (Mobile vs Desktop)
    // --------------------------------------------------------------------------
    const cfgA = HERO_3D_CONFIG.pairA;
    const cfgB = HERO_3D_CONFIG.pairB;

    const startScaleA = isMobile ? cfgA.mobileScale : cfgA.scale;
    const exitScaleA = isMobile ? cfgA.mobileExitScale : cfgA.exitScale;
    const startPosA = isMobile ? cfgA.mobileInitialPos : cfgA.initialPos;
    const exitPosA = isMobile ? cfgA.mobileExitPos : cfgA.exitPos;

    const enterPosB = isMobile ? cfgB.mobileEnterPos : cfgB.enterPos;
    const settledPosB = isMobile ? cfgB.mobileSettledPos : cfgB.settledPos;
    const settledScaleB = isMobile ? cfgB.mobileSettledScale : cfgB.settledScale;

    // --------------------------------------------------------------------------
    // 4. Timeline Interpolation
    // --------------------------------------------------------------------------
    let currentScaleA = startScaleA;
    let currentPosA = [...startPosA] as [number, number, number];
    let currentRotA = [...cfgA.initialRot] as [number, number, number];

    let currentScaleB = cfgB.enterScale;
    let currentPosB = [...enterPosB] as [number, number, number];
    let currentRotB = [...cfgB.enterRot] as [number, number, number];
    let currentOpacityB = 1.0;

    if (progress <= 0.10) {
      // Phase 0.00 to 0.10: PAIR_A large and held behind headline
      currentScaleA = startScaleA;
      currentPosA = [...startPosA];
      currentRotA = [...cfgA.initialRot];

      currentScaleB = cfgB.enterScale;
      currentPosB = [...enterPosB];
      currentRotB = [...cfgB.enterRot];
      currentOpacityB = 1.0;
    } else if (progress <= 0.55) {
      // Phase 0.10 to 0.55: PAIR_A rotates ~70 deg on Y, drifts up-left and leaves screen completely;
      // PAIR_B rises in from off-screen below-right
      const rawT = (progress - 0.10) / 0.45;
      const easeT = easeInOutQuad(Math.min(1, Math.max(0, rawT)));

      currentScaleA = lerp(startScaleA, exitScaleA, easeT);
      currentPosA = [
        lerp(startPosA[0], exitPosA[0], easeT),
        lerp(startPosA[1], exitPosA[1], easeT),
        lerp(startPosA[2], exitPosA[2], easeT),
      ];
      currentRotA = [
        lerp(cfgA.initialRot[0], cfgA.exitRot[0], easeT),
        lerp(cfgA.initialRot[1], cfgA.exitRot[1], easeT),
        lerp(cfgA.initialRot[2], cfgA.exitRot[2], easeT),
      ];

      currentScaleB = lerp(cfgB.enterScale, settledScaleB, easeT);
      currentPosB = [
        lerp(enterPosB[0], settledPosB[0], easeT),
        lerp(enterPosB[1], settledPosB[1], easeT),
        lerp(enterPosB[2], settledPosB[2], easeT),
      ];
      currentRotB = [
        lerp(cfgB.enterRot[0], 0.08, easeT),
        lerp(cfgB.enterRot[1], cfgB.settledRotY, easeT),
        lerp(cfgB.enterRot[2], 0, easeT),
      ];
      currentOpacityB = 1.0;
    } else if (progress <= 0.90) {
      // Phase 0.55 to 0.90: PAIR_B settles large on right/center, slow turntable spin
      currentScaleA = exitScaleA;
      currentPosA = [...exitPosA];
      currentRotA = [...cfgA.exitRot];

      currentScaleB = settledScaleB;
      currentPosB = [...settledPosB];

      // Turntable spin on settled PAIR_B
      const spinTime = (progress - 0.55) / 0.35;
      const turntableRot =
        cfgB.settledRotY + spinTime * 0.7 + Math.sin(t * cfgB.turntableSpeed) * 0.1;

      currentRotB = [0.08, turntableRot, 0];
      currentOpacityB = 1.0;
    } else {
      // Phase 0.90 to 1.00: hold, release pin, fade PAIR_B out
      const fadeT = easeInOutQuad((progress - 0.90) / 0.10);
      currentScaleA = exitScaleA;
      currentPosA = [...exitPosA];
      currentRotA = [...cfgA.exitRot];

      currentScaleB = settledScaleB;
      currentPosB = [
        lerp(settledPosB[0], cfgB.exitPos[0], fadeT),
        lerp(settledPosB[1], cfgB.exitPos[1], fadeT),
        lerp(settledPosB[2], cfgB.exitPos[2], fadeT),
      ];
      currentRotB = [0.08, cfgB.settledRotY + 0.7, 0];
      currentOpacityB = 1 - fadeT;
    }

    // --------------------------------------------------------------------------
    // 5. Idle Float & Rotation on PAIR_A (active when progress < 0.2)
    // --------------------------------------------------------------------------
    const idleWeight = Math.max(0, 1 - progress * 4);
    const floatY =
      Math.sin(t * cfgA.idleFloatFreq) * cfgA.idleFloatAmp * idleWeight;
    const idleRotY =
      Math.sin(t * cfgA.idleRotFreq) * cfgA.idleRotAmp * idleWeight;
    const idleRotX =
      Math.cos(t * cfgA.idleRotFreq * 0.7) * (cfgA.idleRotAmp * 0.35) * idleWeight;

    // Apply transforms to PAIR_A (if visible)
    if (pairA.visible) {
      pairA.scale.setScalar(currentScaleA * normFactors.factorA);
      pairA.position.set(
        currentPosA[0] + posOffX,
        currentPosA[1] + floatY + posOffY,
        currentPosA[2]
      );
      pairA.rotation.set(
        currentRotA[0] + idleRotX + rotOffX,
        currentRotA[1] + idleRotY + rotOffY,
        currentRotA[2]
      );
    }

    // Apply transforms to PAIR_B (if visible)
    if (pairB.visible) {
      pairB.scale.setScalar(currentScaleB * normFactors.factorB);
      pairB.position.set(
        currentPosB[0] + (progress >= 0.5 ? posOffX : 0),
        currentPosB[1] + (progress >= 0.5 ? posOffY : 0),
        currentPosB[2]
      );
      pairB.rotation.set(
        currentRotB[0] + (progress >= 0.5 ? rotOffX : 0),
        currentRotB[1] + (progress >= 0.5 ? rotOffY : 0),
        currentRotB[2]
      );

      // Update PAIR_B opacity on exit fade
      if (!isDebug) {
        pairB.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mat = (child as THREE.Mesh).material as THREE.MeshPhysicalMaterial;
            if (mat && mat.opacity !== currentOpacityB) {
              mat.opacity = currentOpacityB;
            }
          }
        });
      }
    }
  });

  return (
    <group dispose={null}>
      <primitive object={clonedScene} />
    </group>
  );
}

// ==============================================================================
// GRADIENT PLACEHOLDER WHILE LOADING
// ==============================================================================
function Hero3DPlaceholder() {
  return (
    <div
      className="absolute inset-0 pointer-events-none transition-opacity duration-700 opacity-60"
      style={{
        background:
          'radial-gradient(ellipse at 45% 50%, rgba(106,53,39,0.12) 0%, transparent 65%)',
      }}
    />
  );
}

// ==============================================================================
// MAIN HERO CANVAS COMPONENT (Exported for next/dynamic ssr:false)
// ==============================================================================
export default function ShoeHeroCanvas() {
  const [isDebug, setIsDebug] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const mouseParallaxRef = useRef({ x: 0, y: 0 });

  // 1. URL flag ?debug=1 & viewport resize listener
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setIsDebug(params.get('debug') === '1');

      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  // 2. Mouse Parallax event listener (-1 to 1 normalized)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseParallaxRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseParallaxRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 3. ScrollTrigger Pinning and Scrub Timeline
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // Accessibility: prefers-reduced-motion -> no pin and no swap; show PAIR_A static and large
    if (prefersReducedMotion) {
      progressRef.current = 0;
      (window as any).__HERO_SCROLL_PROGRESS__ = 0;
      return;
    }

    const heroSection = containerRef.current?.closest('section');
    if (!heroSection) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        id: 'hero-shoe-swap',
        trigger: heroSection,
        start: HERO_3D_CONFIG.scroll.pinStart,
        end: HERO_3D_CONFIG.scroll.pinEnd,
        pin: true,
        anticipatePin: HERO_3D_CONFIG.scroll.anticipatePin,
        scrub: HERO_3D_CONFIG.scroll.scrub,
        onUpdate: (self) => {
          progressRef.current = self.progress;
          // Store on window for cursor label synchronization
          (window as any).__HERO_SCROLL_PROGRESS__ = self.progress;
        },
      });
    });

    return () => {
      ctx.revert();
    };
  }, []);

  // 4. Performance: Pause rendering when hero is off-screen
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        (window as any).__HERO_IN_VIEW__ = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    >
      <Suspense fallback={<Hero3DPlaceholder />}>
        <Canvas
          frameloop={isVisible ? 'always' : 'never'}
          camera={{
            fov: HERO_3D_CONFIG.camera.fov,
            position: HERO_3D_CONFIG.camera.position,
          }}
          dpr={isMobile ? [1, 1.5] : [1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: HERO_3D_CONFIG.lighting.exposure,
          }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
            gl.outputColorSpace = THREE.SRGBColorSpace;
          }}
        >
          {/* Phase R1: Soft Studio Environment Map (~0.38 intensity) */}
          <Environment
            preset="studio"
            environmentIntensity={HERO_3D_CONFIG.lighting.envIntensity}
          />

          {/* Phase R1: Soft Warm Key Light top-left */}
          <directionalLight
            position={HERO_3D_CONFIG.lighting.keyLight.position}
            intensity={HERO_3D_CONFIG.lighting.keyLight.intensity}
            color={HERO_3D_CONFIG.lighting.keyLight.color}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />

          {/* Phase R1: Soft Rim Light from behind-right */}
          <directionalLight
            position={HERO_3D_CONFIG.lighting.rimLight.position}
            intensity={HERO_3D_CONFIG.lighting.rimLight.intensity}
            color={HERO_3D_CONFIG.lighting.rimLight.color}
          />

          {/* Soft Fill Light */}
          <directionalLight
            position={HERO_3D_CONFIG.lighting.fillLight.position}
            intensity={HERO_3D_CONFIG.lighting.fillLight.intensity}
            color={HERO_3D_CONFIG.lighting.fillLight.color}
          />
          <ambientLight intensity={0.35} color="#F6EEE3" />

          {/* Floor Contact Shadows */}
          <ContactShadows
            position={[0, -1.35, 0]}
            opacity={HERO_3D_CONFIG.lighting.shadowOpacity}
            scale={10.0}
            blur={2.6}
            far={4.0}
            color={HERO_3D_CONFIG.lighting.shadowColor}
          />

          {/* Interactive Shoe Models */}
          <ShoesScene
            isDebug={isDebug}
            isMobile={isMobile}
            progressRef={progressRef}
            mouseParallaxRef={mouseParallaxRef}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}

// Preload 3D model
useGLTF.preload('/models/shoes-split.glb');
