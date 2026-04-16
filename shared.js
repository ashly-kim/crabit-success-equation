// 공통 Tailwind config + 스타일
(function injectCustomFormStyles(){
  if(document.getElementById('__customFormStyles')) return;
  const css = `
  /* 자체 체크박스 */
  input[type="checkbox"]:not(.sr-only):not(.native){
    -webkit-appearance:none; appearance:none;
    width:22px; height:22px; min-width:22px; min-height:22px;
    border:2px solid #d1d5db; border-radius:6px;
    background:#fff; cursor:pointer; position:relative;
    transition:all .12s ease; flex-shrink:0;
    vertical-align:middle;
  }
  input[type="checkbox"]:not(.sr-only):not(.native):hover{ border-color:#3a74ff }
  input[type="checkbox"]:not(.sr-only):not(.native):checked{
    background:#3a74ff; border-color:#3a74ff;
  }
  input[type="checkbox"]:not(.sr-only):not(.native):checked::after{
    content:''; position:absolute; left:6px; top:2px;
    width:6px; height:11px; border:solid #fff;
    border-width:0 2.5px 2.5px 0; transform:rotate(45deg);
  }
  input[type="checkbox"]:not(.sr-only):not(.native):focus-visible{
    box-shadow:0 0 0 4px rgba(58,116,255,.18);
  }

  /* 자체 라디오 */
  input[type="radio"]:not(.sr-only):not(.native){
    -webkit-appearance:none; appearance:none;
    width:22px; height:22px; min-width:22px; min-height:22px;
    border:2px solid #d1d5db; border-radius:9999px;
    background:#fff; cursor:pointer; position:relative;
    transition:all .12s ease; flex-shrink:0;
    vertical-align:middle;
  }
  input[type="radio"]:not(.sr-only):not(.native):hover{ border-color:#3a74ff }
  input[type="radio"]:not(.sr-only):not(.native):checked{ border-color:#3a74ff }
  input[type="radio"]:not(.sr-only):not(.native):checked::after{
    content:''; position:absolute; left:50%; top:50%;
    width:11px; height:11px; border-radius:9999px; background:#3a74ff;
    transform:translate(-50%,-50%);
  }
  input[type="radio"]:not(.sr-only):not(.native):focus-visible{
    box-shadow:0 0 0 4px rgba(58,116,255,.18);
  }
  `;
  const style = document.createElement('style');
  style.id = '__customFormStyles';
  style.textContent = css;
  (document.head || document.documentElement).appendChild(style);
})();

// ===== 인증 & 계정 (LocalStorage 기반 · 백엔드 연결 전까지의 임시 구현) =====
const __ACC_KEY = 'crabit_accounts_v1';
const __SESS_KEY = 'crabit_session_v1';

// 샘플 계정 2개 시딩 (한 번만)
(function seedAccounts(){
  // 샘플 계정 업데이트를 위해 덮어쓰기
  const seed = [
    { phone:'01087912483', password:'crafthabit1@', academy:'크래빗 영어학원', director:'김현지', createdAt: Date.now(), isDemo:true }
  ];
  localStorage.setItem(__ACC_KEY, JSON.stringify(seed));
})();

window.__auth = {
  getAccounts(){ return JSON.parse(localStorage.getItem(__ACC_KEY) || '[]'); },
  saveAccounts(list){ localStorage.setItem(__ACC_KEY, JSON.stringify(list)); },
  findByPhone(phone){ return this.getAccounts().find(a => a.phone === phone.replace(/-/g,'')); },
  signup(data){
    const list = this.getAccounts();
    const norm = data.phone.replace(/-/g,'');
    if(list.some(a => a.phone === norm)) return { ok:false, error:'이미 가입된 휴대폰 번호예요.' };
    list.push({ ...data, phone:norm, createdAt: Date.now() });
    this.saveAccounts(list);
    this.setSession({ phone:norm, academy:data.academy, director:data.director });
    return { ok:true };
  },
  login(phone, password){
    const acc = this.findByPhone(phone);
    if(!acc) return { ok:false, error:'등록되지 않은 휴대폰 번호예요.' };
    if(acc.password !== password) return { ok:false, error:'비밀번호가 일치하지 않아요.' };
    this.setSession({ phone:acc.phone, academy:acc.academy, director:acc.director, isDemo: !!acc.isDemo });
    return { ok:true };
  },
  kakaoLogin(){
    // 카카오 신규 가입: 바로 홈으로 (온보딩 질문 스킵, 홈 CTA로 유도)
    this.setSession({ phone:'', academy:'크래빗 영어학원', director:'김현지', isFreshSignup:true });
    return { ok:true };
  },
  getSession(){ try { return JSON.parse(localStorage.getItem(__SESS_KEY) || 'null'); } catch(e){ return null; } },
  setSession(s){ localStorage.setItem(__SESS_KEY, JSON.stringify(s)); },
  logout(){ localStorage.removeItem(__SESS_KEY); location.href = 'login.html'; },
  // 보호된 페이지: 비로그인 시 로그인으로 리다이렉트, 온보딩 미완료 시 온보딩으로
  requireAuth(){
    const s = this.getSession();
    if(!s){ location.href = 'login.html'; return false; }
    if(s.isFreshSignup){ location.href = 'onboarding.html'; return false; }
    return true;
  }
};

// 비밀번호 검증 (티처스 규칙: 8자+, 영문/숫자/특수문자 중 2종류 이상)
window.__validatePassword = function(pw){
  if(!pw || pw.length < 8) return { ok:false, error:'비밀번호는 8자 이상이어야 해요.' };
  let kinds = 0;
  if(/[A-Za-z]/.test(pw)) kinds++;
  if(/[0-9]/.test(pw)) kinds++;
  if(/[!@#$%^&*()_\-+=\[\]{};:'",.<>?/\\|`~]/.test(pw)) kinds++;
  if(kinds < 2) return { ok:false, error:'영문·숫자·특수문자 중 2종류 이상을 포함해주세요.' };
  return { ok:true };
};

// 휴대폰 번호 포맷: 01012345678 → 010-1234-5678
window.__formatPhone = function(raw){
  const digits = (raw || '').replace(/\D/g, '').slice(0, 11);
  if(digits.length < 4) return digits;
  if(digits.length < 8) return `${digits.slice(0,3)}-${digits.slice(3)}`;
  return `${digits.slice(0,3)}-${digits.slice(3,7)}-${digits.slice(7)}`;
};

window.__applyTheme = function(){
  tailwind.config = {
    theme: {
      extend: {
        fontFamily: { sans: ['Pretendard Variable','Pretendard','system-ui','sans-serif'] },
        colors: {
          brand: {
            50:'#eef4ff', 100:'#dbe7ff', 200:'#b9d0ff', 300:'#8ab0ff',
            400:'#5a8eff', 500:'#3a74ff', 600:'#2559e6', 700:'#1e48b8', 900:'#132a66'
          },
          accent: {
            50:'#fff1f5', 100:'#ffdde7', 200:'#ffbccd', 300:'#fb93ad',
            500:'#f04685', 600:'#d32e6c', 700:'#a62256'
          },
          ink: { 900:'#111827', 700:'#374151', 500:'#6b7280', 300:'#d1d5db' },
          soft: {
            navy:'#eef4ff', pink:'#ffe9ef', blush:'#fff1f4', mint:'#e3f7ee',
            lemon:'#fff5d6', lilac:'#efe7ff', peach:'#ffe8d9'
          }
        },
        boxShadow: {
          card:'0 1px 2px rgba(17,24,39,.04), 0 8px 24px rgba(17,24,39,.06)',
          soft:'0 1px 2px rgba(17,24,39,.04), 0 4px 12px rgba(17,24,39,.04)'
        },
        borderRadius: { '2xl':'1rem','3xl':'1.5rem' }
      }
    }
  }
};

window.__renderLayout = function(active){
  const navItems = [
    {id:'home', label:'홈', href:'index.html', svg:'<path d="M3 12l9-8 9 8"/><path d="M5 10v10h14V10"/>'},
    {id:'hub', label:'데이터 허브', href:'hub.html', svg:'<path d="M4 7h16M4 12h16M4 17h10"/>'},
    {id:'hub2', label:'데이터 허브 2', href:'hub2.html', svg:'<path d="M12 2l3 7h7l-5.5 4 2 7-6.5-4-6.5 4 2-7L2 9h7z"/>'},
    {id:'report', label:'리포트카드', href:'report.html', svg:'<path d="M7 3h10l3 4v14H4V7z"/><path d="M8 12h8M8 16h5"/>'},
    {id:'lecture', label:'사용 가이드', href:'lecture.html', svg:'<path d="M3 5h12a3 3 0 013 3v12H6a3 3 0 01-3-3V5z"/><path d="M3 5a3 3 0 013-3h12"/><path d="M8 9h8M8 13h6"/>'}
  ];
  const navHtml = navItems.map(n=>`
    <a class="nav-item ${n.id===active?'active':''} flex items-center gap-3 px-3 py-2.5 rounded-xl text-ink-700 hover:bg-gray-50" href="${n.href}">
      <svg class="w-5 h-5 text-ink-500" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">${n.svg}</svg>
      ${n.label}
    </a>
  `).join('');

  return `
  <aside class="w-64 shrink-0 bg-white border-r border-gray-100 hidden lg:flex flex-col sticky top-0 h-screen">
    <a href="index.html" class="px-6 py-6 flex items-center gap-2 hover:bg-gray-50 transition">
      <div class="w-9 h-9 rounded-xl bg-brand-500 grid place-items-center text-white font-bold">우</div>
      <div class="leading-tight">
        <div class="font-bold text-lg">우리학원</div>
        <div class="text-xs text-ink-500">성공방정식</div>
      </div>
    </a>
    <nav class="px-3 mt-2 space-y-1 text-[15px]">
      ${navHtml}
      <div class="px-3 pt-6 pb-2 text-xs font-semibold text-ink-500">계정</div>
      <a class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-ink-700 hover:bg-gray-50" href="#">
        <svg class="w-5 h-5 text-ink-500" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c2-4 6-6 8-6s6 2 8 6"/></svg>
        내 학원 설정
      </a>
      <a class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-ink-700 hover:bg-gray-50" href="#">
        <svg class="w-5 h-5 text-ink-500" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 00-.1-1.2l2-1.5-2-3.5-2.3.9a7 7 0 00-2-1.2L14 3h-4l-.6 2.5a7 7 0 00-2 1.2L5 5.8l-2 3.5 2 1.5A7 7 0 005 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.5 2.3-.9a7 7 0 002 1.2L10 21h4l.6-2.5a7 7 0 002-1.2l2.3.9 2-3.5-2-1.5c.1-.4.1-.8.1-1.2z"/></svg>
        환경설정
      </a>
    </nav>
    <div class="mt-auto p-4 space-y-2">
      <div class="rounded-2xl bg-soft-blush p-4">
        <div class="text-sm font-semibold">Alumni 플랜</div>
        <div class="text-xs text-ink-500 mt-1">첫 달 무료 · 수강생 전용</div>
        <button class="mt-3 w-full bg-white text-brand-600 text-sm font-semibold py-2 rounded-lg border border-brand-100 hover:bg-brand-50">구독 관리</button>
      </div>
      <button onclick="__auth.logout()" class="w-full text-xs text-ink-500 hover:text-ink-900 py-2">로그아웃 →</button>
    </div>
  </aside>
  `;
};

window.__renderTopbar = function(crumbs){
  const crumbHtml = crumbs.map((c,i)=>`
    <span class="${i===crumbs.length-1?'text-ink-700 font-medium':''}">${c}</span>
    ${i<crumbs.length-1?'<span>›</span>':''}
  `).join('');
  const sess = window.__auth && window.__auth.getSession();
  const director = sess?.director || '원장';
  const academy = sess?.academy || '';
  const initial = director ? director[0] : '?';
  return `
  <header class="bg-white border-b border-gray-100 sticky top-0 z-20">
    <div class="px-8 py-4 flex items-center justify-between">
      <div class="flex items-center gap-2 text-sm text-ink-500">${crumbHtml}</div>
      <div class="flex items-center gap-3">
        <button class="relative w-10 h-10 rounded-full border border-gray-200 grid place-items-center hover:bg-gray-50">
          <svg class="w-5 h-5 text-ink-700" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M18 16V11a6 6 0 10-12 0v5l-2 3h16z"/><path d="M10 20a2 2 0 004 0"/></svg>
          <span class="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent-500"></span>
        </button>
        <div class="flex items-center gap-3 pl-3 border-l border-gray-100">
          <div class="w-9 h-9 rounded-full bg-brand-100 text-brand-700 grid place-items-center font-bold">${initial}</div>
          <div class="leading-tight">
            <div class="text-sm font-semibold">${director} 원장님</div>
            <div class="text-xs text-ink-500">${academy}</div>
          </div>
        </div>
      </div>
    </div>
  </header>
  `;
};

// ===== 공통 푸터 (저작권·무단 이용 경고) =====
window.__renderFooter = function(){
  return `
  <footer class="mt-16 border-t border-gray-200 bg-white">
    <div class="max-w-[1280px] mx-auto px-8 py-8 space-y-2 text-[11px] text-ink-500 leading-relaxed">
      <div class="flex items-center gap-2 mb-2">
        <div class="w-6 h-6 rounded-md bg-brand-500 grid place-items-center text-white font-bold text-[11px]">우</div>
        <span class="text-ink-700">우리학원 성공방정식</span>
        <span class="text-ink-300">by CRABIT</span>
      </div>
      <p class="max-w-3xl">
        본 사이트의 모든 콘텐츠·분석 방법론·리포트 템플릿·UI 디자인의 저작권은 ㈜크래빗(CRABIT)에 있습니다. 동의 없이 무단 복제·배포·판매 등을 금지하며, 위반 시 저작권법 등 관련 법령에 따라 민·형사상 책임을 질 수 있습니다.
      </p>
      <p class="text-[11px] text-ink-400">© 2026 Crabit. Co., Ltd. All Rights Reserved</p>
    </div>
  </footer>
  `;
};
