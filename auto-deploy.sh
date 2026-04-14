#!/bin/bash
# 파일 변경 감지 시 자동 배포
# 사용: ./auto-deploy.sh (foreground) 또는 nohup ./auto-deploy.sh & (background)

SITE_ID="ba2c01c5-f779-499a-b8b9-fb7b707f310a"
PROXY='https://netlify-mcp.netlify.app/proxy/eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..SYy_6wV9BWeDTK4O.NZHsdeKrtwt_GavDAWeIb9f5q_RCVQlXF5YfWgVpIvPiHehcCHoUqdvLx3C34OcjiyfD5yiYMVTZtzJqUv660ykdVlSQaPgr0RjtCWNQ8MY-Mdub7cFHA76uMnH9aceLOPD0775iMs10ELwZRKzDSI-hzyqDyHrQ0Wxoca32krJrAv0FzBA15StywztABc98O7Coh3N7RRp9O0K6UggoKEXHcJtP13izmia88bfhW-4ptovAPhI5ehXAo0k1ASXgJAFwH9c3wzv1Fv6aTKErWnKj3Y-Gr4RkZvZs4GmFcqpzP5jdozU6El6x0AERfFQwMGeSmfWHPyh_CXtq52MSgYr9ZxFlMEW8gargQKgUluT7ltY-oQ.DB-Cb34nLBj_dbBaD3_vsw'

cd "$(dirname "$0")"

deploy() {
  echo "🚀 $(date +'%H:%M:%S') 배포 시작..."
  npx -y @netlify/mcp@latest --site-id "$SITE_ID" --proxy-path "$PROXY" --no-wait 2>&1 | grep -E "Deploy|Error|started" || true
  echo "✅ $(date +'%H:%M:%S') 배포 완료 → https://crabit-success-equation.netlify.app"
  echo "---"
}

# fswatch가 없으면 설치 안내
if ! command -v fswatch &> /dev/null; then
  echo "fswatch가 필요합니다. 설치: brew install fswatch"
  exit 1
fi

echo "📡 파일 변경 감시 중... (Ctrl+C로 종료)"
echo "감시 대상: *.html, *.js, *.css"
echo ""

# 최초 1회 배포 생략 - 필요시 수동으로 ./deploy-now.sh
fswatch -o -e ".*" -i "\\.html$" -i "\\.js$" -i "\\.css$" . | while read num; do
  deploy
done
