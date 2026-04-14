// 파일 변경 감지 → 자동 git commit + push (GitHub Pages 자동 배포)
// 사용: node watch.js
// 추가 설치 불필요 (Node 기본 모듈만 사용)

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const SITE_URL = 'https://ashly-kim.github.io/crabit-success-equation/';
const DIR = __dirname;
const EXT = ['.html', '.js', '.css'];

let timer = null;
let deploying = false;
let pending = false;

function ts(){ return new Date().toTimeString().slice(0,8); }

function run(cmd, args){
  return new Promise((resolve, reject)=>{
    const p = spawn(cmd, args, { cwd: DIR });
    let out = '', err = '';
    p.stdout.on('data', d => out += d);
    p.stderr.on('data', d => err += d);
    p.on('close', code => {
      if(code === 0) resolve(out.trim());
      else reject(new Error(err || `exit ${code}`));
    });
  });
}

async function deploy(){
  if(deploying){ pending = true; return; }
  deploying = true;
  console.log(`\n🚀 [${ts()}] 배포 시작...`);
  try {
    await run('git', ['add', '-A']);
    // 변경사항 있는지 확인
    const status = await run('git', ['status', '--porcelain']);
    if(!status){
      console.log(`⏭️  [${ts()}] 변경 없음. 스킵`);
    } else {
      const msg = `Update ${new Date().toISOString()}`;
      await run('git', ['commit', '-m', msg]);
      await run('git', ['push', 'origin', 'main']);
      console.log(`✅ [${ts()}] 푸시 완료 → 1~2분 후 반영`);
      console.log(`   ${SITE_URL}`);
    }
  } catch(e){
    console.log(`❌ [${ts()}] 실패: ${e.message}`);
  }
  deploying = false;
  console.log('─'.repeat(60));
  if(pending){ pending = false; scheduleDeploy(); }
}

function scheduleDeploy(){
  clearTimeout(timer);
  timer = setTimeout(deploy, 2000); // 2초 debounce
}

function watchDir(dir){
  fs.watch(dir, { recursive: false }, (event, filename) => {
    if(!filename) return;
    if(filename.startsWith('.')) return;
    if(filename === 'watch.js' || filename === 'watch.log') return;
    const ext = path.extname(filename);
    if(!EXT.includes(ext)) return;
    console.log(`📝 [${ts()}] ${filename} 변경 감지`);
    scheduleDeploy();
  });
}

console.log('📡 파일 변경 감시 시작 (GitHub Pages)');
console.log(`📁 ${DIR}`);
console.log(`🌐 ${SITE_URL}`);
console.log(`👀 감시: ${EXT.join(', ')}`);
console.log('─'.repeat(60));
watchDir(DIR);
