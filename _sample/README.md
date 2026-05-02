# 샘플 모음

실제 입력(시나리오)·출력(리포트) 형식을 미리 보기 위한 가상 데이터입니다.
프로젝트 루트 구조(`scenarios/`, `reports/`)를 그대로 미러링합니다.

## 구조

```
_sample/
├── scenarios/            ← 시나리오 작성 예시
│   ├── 01-회원가입.md
│   └── 02-로그인.md
└── reports/              ← 리포트 결과 예시 (가정: 3시나리오 × 5회 실행)
    ├── STATUS.md         ← 5회 누적 후 현황판
    ├── HISTORY.md        ← 5회 시계열 로그
    ├── dashboard.html    ← 시각 대시보드 양식
    └── RUN-20260502-1430-dev/  ← 마지막 회차 상세
        ├── summary.md
        ├── 01-회원가입_result.md
        ├── 02-로그인_result.md
        ├── 03-결제_result.md
        └── screenshots/
```

## 리포트 샘플 시나리오 가정
- **3개 시나리오**: 01-회원가입 / 02-로그인 / 03-결제
- **환경**: dev
- **누적 5회 실행**, 마지막 RUN-20260502-1430-dev
- **이번 회차 결과**: 12 TC 중 9 Pass / 3 Fail

## 사용 방법
- 시나리오 작성 시 → `_sample/scenarios/` 의 예시를 참고해 프로젝트 루트 `scenarios/` 에 작성 (템플릿 골격은 `scenarios/_template.md`)
- 리포트 형식 확인 시 → `_sample/reports/` 의 양식 참조. 실제 첫 실행 시 프로젝트 루트 `reports/` 직속에 새 STATUS/HISTORY/RUN 폴더가 생성됩니다.
