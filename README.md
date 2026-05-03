# QA Automation

PM이 자연어로 시나리오를 작성하고, Claude가 브라우저를 직접 조작해 테스트를 실행·리포트하는 워크플로우.

## 폴더 구조

| 폴더 | 용도 |
|---|---|
| `specs/` | 기획서·정책서 등 참고 자료 원본 (PDF/DOCX/MD) |
| `scenarios/` | 자연어 테스트 시나리오 (`_template.md` 참고) |
| `environments/` | 환경별 URL·계정 (dev/stage/prd) |
| `reports/` | 테스트 실행 결과 |
| `PLAN.md` | 전체 계획서 |

## 사용 흐름

1. `specs/` 에 기획서·정책서 배치
2. `environments/dev.md` 에 URL·계정 입력
3. `scenarios/` 에 시나리오 .md 작성 (`_template.md` 복사해서 시작)
4. Claude에게 요청: "회원가입 시나리오 dev 환경에서 실행해줘"
5. 결과 확인:
   - `reports/STATUS.md` — 전체 현황 한눈에
   - `reports/HISTORY.md` — 시계열 이력
   - `reports/RUN-.../` — 회차별 스크린샷·로그

## RUN ID 규칙

`RUN-YYYYMMDD-HHMM-{환경}` — 예: `RUN-20260502-1430-dev`

## 자세한 내용

→ [`PLAN.md`](./PLAN.md)
