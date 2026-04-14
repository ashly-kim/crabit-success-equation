#!/bin/bash
# 즉시 1회 배포 (git push 기반 · GitHub Pages)
cd "$(dirname "$0")"
echo "🚀 배포 중..."
git add -A
if [[ -z "$(git status --porcelain)" ]]; then
  echo "⏭️  변경사항 없음"
  exit 0
fi
git commit -m "Update $(date +%Y-%m-%d_%H:%M:%S)"
git push origin main
echo "✅ 푸시 완료 → 1~2분 후 반영"
echo "   https://ashly-kim.github.io/crabit-success-equation/"
