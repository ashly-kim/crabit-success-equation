# 우리학원 성공방정식 · 사이트 프로토타입

## 🌐 배포 URL
https://crabit-success-equation.netlify.app

## 📄 페이지
- `/index.html` — 홈
- `/hub.html` — 데이터 허브
- `/equation.html` — 성공방정식 빌더 (8단계)
- `/report.html` — 리포트카드 생성기
- `/lecture.html` — 강의 복습

## ⚡ 자주 쓰는 명령어

### 자동 배포 감시 시작 (파일 저장하면 자동 배포)
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

### watch 프로세스 종료
```bash
pkill -f "node watch.js"
```

### watch 재시작 (종료 + 시작)
```bash
pkill -f "node watch.js"
cd "/Users/ashleykim/Desktop/CRABIT/학부모 소통전략 & 회귀분석 강의/사이트 프로토타입"
nohup node watch.js > watch.log 2>&1 &
```

### 로컬에서 브라우저로 열기
```bash
open "/Users/ashleykim/Desktop/CRABIT/학부모 소통전략 & 회귀분석 강의/사이트 프로토타입/index.html"
```

### 배포 대시보드 열기
```bash
open "https://app.netlify.com/projects/crabit-success-equation"
```

## 🗂 파일 구조
```
사이트 프로토타입/
├── index.html       # 홈
├── hub.html         # 데이터 허브
├── equation.html    # 성공방정식 빌더
├── report.html      # 리포트카드 생성기
├── lecture.html     # 강의 복습
├── shared.js        # 공통 사이드바·탑바·테마
├── watch.js         # 파일 변경 감지 자동 배포 (Node)
├── deploy-now.sh    # 즉시 1회 배포
├── auto-deploy.sh   # fswatch 기반 자동 배포 (미사용 · fswatch 필요)
├── watch.log        # 자동 배포 로그
└── README.md        # 이 파일
```

## 🧩 Netlify 정보
- Site ID: `ba2c01c5-f779-499a-b8b9-fb7b707f310a`
- Project Name: `crabit-success-equation`
- Team: Hyunji Kim (hyunji@crabit.co.kr)

## ⚙️ 자동 배포 동작 원리
1. `watch.js`가 백그라운드에서 `.html/.js/.css` 파일 변경을 감지
2. 변경 감지 시 1.5초 debounce (연속 저장 묶어서 1번만 배포)
3. `npx @netlify/mcp@latest ... --no-wait`로 업로드
4. Netlify가 알아서 빌드·배포

## 💡 팁
- 여러 파일 한번에 수정해도 debounce 덕에 1번만 배포됨
- `--no-wait` 옵션으로 배포 완료를 기다리지 않고 바로 다음 작업 가능
- 배포 상태는 Netlify 대시보드에서 확인 가능
