# 우리학원 성공방정식 · 사이트 프로토타입

## 🌐 배포 URL
https://ashly-kim.github.io/crabit-success-equation/

## 📄 페이지
- `/index.html` — 홈
- `/hub.html` — 데이터 허브
- `/report.html` — 리포트카드 생성기
- `/lecture.html` — 사용 가이드

## ⚙️ 호스팅
**GitHub Pages** (무료 · 영구)
- 저장소: https://github.com/ashly-kim/crabit-success-equation
- `main` 브랜치 push → 1~2분 후 자동 반영

## ⚡ 자주 쓰는 명령어

### 자동 배포 감시 시작 (파일 저장 → 자동 git push)
```bash
cd "/Users/ashleykim/Desktop/CRABIT/학부모 소통전략 & 회귀분석 강의/사이트 프로토타입"
nohup node watch.js > watch.log 2>&1 &
```

### 실시간 배포 로그 보기
```bash
tail -f "/Users/ashleykim/Desktop/CRABIT/학부모 소통전략 & 회귀분석 강의/사이트 프로토타입/watch.log"
```

### 즉시 1회 수동 배포
```bash
cd "/Users/ashleykim/Desktop/CRABIT/학부모 소통전략 & 회귀분석 강의/사이트 프로토타입"
./deploy-now.sh
```

### watch 프로세스 상태 확인
```bash
ps aux | grep "node watch.js" | grep -v grep
```

### watch 프로세스 종료 / 재시작
```bash
pkill -f "node watch.js"
cd "/Users/ashleykim/Desktop/CRABIT/학부모 소통전략 & 회귀분석 강의/사이트 프로토타입"
nohup node watch.js > watch.log 2>&1 &
```

### 로컬에서 브라우저로 열기
```bash
open "/Users/ashleykim/Desktop/CRABIT/학부모 소통전략 & 회귀분석 강의/사이트 프로토타입/index.html"
```

### GitHub 저장소 / Pages 설정 열기
```bash
open "https://github.com/ashly-kim/crabit-success-equation"
open "https://github.com/ashly-kim/crabit-success-equation/settings/pages"
```

## 🗂 파일 구조
```
사이트 프로토타입/
├── index.html       # 홈
├── hub.html         # 데이터 허브 (성공방정식 포함)
├── report.html      # 리포트카드 생성기
├── lecture.html     # 사용 가이드
├── shared.js        # 공통 사이드바·탑바·테마
├── watch.js         # 파일 변경 감지 자동 git push
├── deploy-now.sh    # 즉시 1회 배포
├── watch.log        # 자동 배포 로그
├── .gitignore
└── README.md
```

## 💡 비용
- GitHub Pages: **무료** (대역폭 100GB/월, 저장 1GB)
- 현재 사이트 크기: 약 200KB → 한도의 0.02%
- GitHub Actions: 무료 (public 저장소 무제한)

## 🔄 자동 배포 동작 원리
1. `watch.js`가 백그라운드에서 `.html/.js/.css` 파일 변경 감지
2. 2초 debounce (연속 저장 묶어서 1번만)
3. `git add -A && git commit && git push origin main`
4. GitHub Pages가 자동으로 빌드·배포 (보통 30초~2분)
