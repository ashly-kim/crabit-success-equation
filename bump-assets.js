// HTML 안의 로컬 .js/.css 참조에 ?v=timestamp 쿼리를 부착해서
// 브라우저/CDN 캐시를 무력화한다.
// 사용: node bump-assets.js
const fs = require('fs');
const path = require('path');

function bump(dir){
  const stamp = Date.now();
  const htmlFiles = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
  let changed = 0;
  for(const file of htmlFiles){
    const full = path.join(dir, file);
    let src = fs.readFileSync(full, 'utf8');
    const before = src;
    src = src.replace(/(<script\s+[^>]*src=")([^"]+\.js)(\?v=\d+)?(")/g, (m, pre, url, _q, post) => {
      if(/^https?:\/\//i.test(url) || url.startsWith('//')) return m;
      return `${pre}${url}?v=${stamp}${post}`;
    });
    src = src.replace(/(<link\s+[^>]*href=")([^"]+\.css)(\?v=\d+)?(")/g, (m, pre, url, _q, post) => {
      if(/^https?:\/\//i.test(url) || url.startsWith('//')) return m;
      return `${pre}${url}?v=${stamp}${post}`;
    });
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
