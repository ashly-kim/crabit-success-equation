// Node 기본 모듈만 사용 - 추가 설치 불필요
// 사용: node watch.js
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const SITE_ID = 'ba2c01c5-f779-499a-b8b9-fb7b707f310a';
const PROXY = 'https://netlify-mcp.netlify.app/proxy/eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..rkMMxlwvYrrTv22g.ZdN0uO5cAYDWwAWvZdO6k5oMjSyZyBni5IsdTJUQcffBu0Zqvbv_XTaWUvmBpX2ttKQdyi7xuWp4wSVqikhehW5_A2ZfBZV7xu16aY4TiZUsLU4C1U4b080v2yyexuIcZL22lyd1-mx3QakaK0T4tKpmr6v3oYeXzPaOb3EGlzDqto0RE7budiinBy9EIgNLmnRmlRxH9R_PhUdUEiC-RXpJk3yQ4zscFWauJaiy-EuPL2GHyfDAzhdY-RDxVjqIhk3DztzRgnGFQ_1kkRNHdTNrxQB1CrWLkIzlpJRE_d93_LmDjeNzU-egrvA4IQe70YXGmzxfq65hOF8HvvfGgacyvc7KScj1kiRtX9QIWP2nE7yPng.OkAbmCpMs9DIIcY5lBRoVA';
const SITE_URL = 'https://crabit-success-equation.netlify.app';

const DIR = __dirname;
const EXT = ['.html', '.js', '.css'];

let timer = null;
let deploying = false;
let pending = false;

function ts() {
  const d = new Date();
  return d.toTimeString().slice(0, 8);
}

function deploy() {
  if (deploying) { pending = true; return; }
  deploying = true;
  console.log(`\n🚀 [${ts()}] 배포 시작...`);
  const proc = spawn('npx', ['-y', '@netlify/mcp@latest', '--site-id', SITE_ID, '--proxy-path', PROXY, '--no-wait'], {
    cwd: DIR, stdio: 'inherit'
  });
  proc.on('close', (code) => {
    deploying = false;
    if (code === 0) console.log(`✅ [${ts()}] 완료 → ${SITE_URL}`);
    else console.log(`❌ [${ts()}] 실패 (exit ${code})`);
    console.log('─'.repeat(60));
    if (pending) { pending = false; scheduleDeploy(); }
  });
}

function scheduleDeploy() {
  clearTimeout(timer);
  timer = setTimeout(deploy, 1500); // 1.5초 debounce
}

function watchDir(dir) {
  fs.watch(dir, { recursive: false }, (event, filename) => {
    if (!filename) return;
    if (filename.startsWith('.')) return;
    if (filename === 'watch.js') return;
    const ext = path.extname(filename);
    if (!EXT.includes(ext)) return;
    console.log(`📝 [${ts()}] ${filename} 변경 감지`);
    scheduleDeploy();
  });
}

console.log('📡 파일 변경 감시 시작');
console.log(`📁 ${DIR}`);
console.log(`🌐 ${SITE_URL}`);
console.log(`👀 감시: ${EXT.join(', ')}`);
console.log('─'.repeat(60));
watchDir(DIR);
