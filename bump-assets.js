// HTML 안의 로컬 .js/.css 참조에 ?v=timestamp 쿼리를 부착해서
// 브라우저/CDN 캐시를 무력화한다.
// 사용: node bump-assets.js
const fs = require('fs');
const path = require('path');

const CACHE_META = `<meta http-equiv="Cache-Control" content="no-cache, max-age=0, must-revalidate" />
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="0" />`;

function bump(dir){
  const stamp = Date.now();
  const htmlFiles = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
  let changed = 0;
  for(const file of htmlFiles){
    const full = path.join(dir, file);
    let src = fs.readFileSync(full, 'utf8');
    const before = src;

    // 로컬 .js 참조에 ?v=ts 부착
    src = src.replace(/(<script\s+[^>]*src=")([^"]+\.js)(\?v=\d+)?(")/g, (m, pre, url, _q, post) => {
      if(/^https?:\/\//i.test(url) || url.startsWith('//')) return m;
      return `${pre}${url}?v=${stamp}${post}`;
    });
    // 로컬 .css 참조에 ?v=ts 부착
    src = src.replace(/(<link\s+[^>]*href=")([^"]+\.css)(\?v=\d+)?(")/g, (m, pre, url, _q, post) => {
      if(/^https?:\/\//i.test(url) || url.startsWith('//')) return m;
      return `${pre}${url}?v=${stamp}${post}`;
    });
    // no-cache 메타 태그가 없으면 추가 (viewport meta 바로 뒤에)
    if(!/http-equiv=["']Cache-Control["']/i.test(src)){
      src = src.replace(/(<meta\s+name=["']viewport["'][^>]*\/?>)/i, `$1\n${CACHE_META}`);
    }

    if(src !== before){
      fs.writeFileSync(full, src);
      changed++;
    }
  }
  return {stamp, changed};
}

if(require.main === module){
  const r = bump(__dirname);
  console.log(`🔖 자산 버전 갱신 (?v=${r.stamp}) · HTML ${r.changed}개`);
}

module.exports = { bump };
