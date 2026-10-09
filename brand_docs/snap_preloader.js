const { execSync } = require('child_process');
const fs = require('fs');

const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const out = 'c:\\Users\\User\\Desktop\\yakasonshoes\\brand_docs\\yakason_preloader_active.png';

console.log('Taking screenshot at 1.5 seconds...');
// Use powershell to launch edge with quick screenshot
try {
  execSync(`powershell -Command "Start-Process -FilePath '${edge}' -ArgumentList '--headless=new', '--window-size=1440,900', '--screenshot=${out}', 'http://localhost:3000' -Wait"`);
  console.log('Screenshot taken, size:', fs.statSync(out).size);
} catch (e) {
  console.error(e);
}
