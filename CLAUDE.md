# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 정체성

PM(대표님)이 자연어 시나리오만 작성하고, Claude 가 Playwright MCP 로 실제 브라우저를 조작해 블랙박스 QA 를 수행하는 워크스페이스입니다. 코드 빌드·유닛테스트는 없습니다. **산출물은 마크다운 시나리오·리포트와 시각 대시보드(HTML+data.js)** 가 전부입니다.

자세한 의도·로드맵은 `PLAN.md`, 사용 흐름은 `README.md` 참조.

## 실행 아키텍처 — 메인 Claude × `/qa-run` Skill

핵심은 **시나리오 단위 격리 실행**입니다. 흐름은 단방향:

```
대표님 요청  →  메인 Claude (오케스트레이터)
                  │  RUN-ID 생성, reports/{RUN-ID}/ 초기화
                  │  시나리오마다 ↓ 호출
                  ▼
              /qa-run Skill (context: fork, sonnet)   ← 격리, 순차 dispatch
                  │  Playwright MCP 로 브라우저 조작
                  │  TC 끝날 때마다 progress.jsonl 즉시 append
                  │  시나리오 종료 시:
                  │    ├ result.md 작성
                  │    ├ data.js 풀 빌드 + 덮어쓰기 (대시보드 즉시 반영)
                  │    └ scenarios/{시나리오}.md 의 "최근 실행 결과" 표 갱신
                  ▼  요약만 반환 (스크린샷·DOM 본문 절대 X)
              메인 Claude (마무리)
                  │  HISTORY.md append, STATUS.md 덮어쓰기
                  │  data.js 의 issues / history / total_runs 영역만 보강
```

- Skill 정의: `.claude/skills/qa-run/SKILL.md` — 시나리오 1개 실행의 모든 절차·규칙이 여기에 있음. 시나리오 실행 로직을 수정할 때는 이 파일이 단일 출처.
- 메인 Claude 의 책임은 **dispatch + 집계**뿐. 실제 브라우저 조작·검증은 절대 메인에서 하지 말 것 (컨텍스트 보호).
- 격리 단위는 시나리오. 사전조건 공유 이득이 격리 손실보다 크면 재평가.

## RUN-ID 규칙

`RUN-YYYYMMDD-HHMM-{환경}` — 예: `RUN-20260502-1430-dev`. 메인이 생성해 모든 하위 산출물에서 동일하게 사용.

## 폴더 책임 분리

| 폴더 | 추적 | 역할 |
|---|---|---|
| `specs/` | O | 기획서·정책서 원본 (PDF/DOCX/MD). 시나리오 작성의 입력. |
| `scenarios/` | O | 자연어 테스트 시나리오. **핵심 자산.** `_template.md` 골격 사용. |
| `environments/_template.md` | O | 환경 양식만 추적 |
| `environments/{dev,stage,prd}.md` | **X (gitignored)** | 민감정보 (URL·계정·테스트카드). 절대 커밋·요약·로그에 노출 금지. |
| `templates/` | O | **빈 양식 source of truth.** `dashboard.html` · `data.js` · `STATUS.md` · `HISTORY.md`. |
| `reports/` | **X (전체 ignore)** | 휘발성 산출물. 첫 실행 시 메인 Claude 가 `templates/` → `reports/` 로 복사. |
| `_sample/` | O | 시나리오·리포트 예시 (가상 데이터). 양식 미리보기용. |

## 3계층 이력 관리 — 갱신 주체와 시점

| 파일 | 갱신 시점 | 누가 |
|---|---|---|
| `reports/{RUN-ID}/progress.jsonl` | TC 끝날 때마다 1줄 append | `/qa-run` Skill (즉시) |
| `reports/{RUN-ID}/{시나리오}_result.md` | 시나리오 종료 시 | `/qa-run` Skill |
| `reports/data.js` (`scenarios` / `kpis` / `meta`) | **시나리오 종료 시마다 풀 빌드 + 덮어쓰기** | **`/qa-run` Skill** |
| `reports/data.js` (`issues` / `history` / `total_runs` / `runs_by_env`) | RUN 전체 종료 시 보강 | 메인 Claude |
| `reports/STATUS.md` | 매 실행 후 덮어쓰기 | 메인 Claude |
| `reports/HISTORY.md` | 매 실행 후 한 줄 append | 메인 Claude |
| `scenarios/{시나리오}.md` 하단 "최근 실행 결과" 표 | **시나리오 종료 시** (자기 시나리오만, 최신 5행 유지) | **`/qa-run` Skill** |
| `reports/dashboard.html` | 거의 변경 X (구조 개편 시만) | 사람 |

## 시각화 정책

- 단일 HTML 대시보드 + `data.js` 분리 구조. **`dashboard.html` 은 구조·렌더링 JS 만, 데이터는 전부 `data.js`** (`window.QA_DATA`).
- 매 실행 후 메인이 갱신하는 것은 **`reports/data.js` 한 파일뿐**. 스키마 주체는 `templates/dashboard.html` 의 렌더링 JS.
- 마크다운에는 mermaid 등 차트 임베드 금지. 시각화는 대시보드에서만.
- **"전체 시나리오 / TC" 영역은 카탈로그 + 오버레이**. `data.js` 의 `scenarios` 배열은 최근 회차 실행분이 아니라 `scenarios/*.md` 의 **전체 시나리오·TC 카탈로그**여야 한다. 메인 Claude 는 매 실행 후 `data.js` 작성 시 `scenarios/` 폴더를 스캔해 카탈로그를 빌드(파일명 오름차순)하고, 이번 회차 결과를 각 TC 의 `status`(`PASS`/`FAIL`/`—`)에 오버레이한다. 이번 회차에 실행되지 않은 TC 는 `status: "—"`.

## Playwright MCP

`.mcp.json` 에 `playwright` 서버 등록 (`@playwright/mcp@latest`). `.claude/settings.local.json` 에서 활성화 상태. `/qa-run` Skill 안에서만 사용:
- `browser_navigate` / `browser_click` / `browser_type` / `browser_press_key` — 인터랙션
- `browser_snapshot` — 접근성 트리 기반 검증
- `browser_take_screenshot` — `reports/{RUN-ID}/screenshots/` 에 PNG 저장. 파일명: `{scenario-slug}-{tc-id}-{step}-{설명}.png`
- `browser_console_messages` — 콘솔 에러 확인

## 즉시 기록 — `progress.jsonl`

TC 1개 끝날 때마다 즉시 1줄 append (다음 TC 진행 전). 중간 중단되어도 직전까지 결과 보존이 목적이므로 **건너뛰기 절대 금지**.

```json
{"ts":"2026-05-02T14:30:42","run_id":"RUN-20260502-1430-dev","scenario":"01-회원가입","tc":"TC-01","result":"PASS","duration_ms":3200,"screenshot":["screenshots/signup-tc01-step1.png"],"note":""}
```

`result`: `PASS` / `FAIL` / `SKIP` / `BLOCKED`(선행 TC 의존 실패).

## 메인 ↔ Skill 반환 경계

`/qa-run` 가 메인에 반환하는 요약은 **300단어 이내**, 다음만 포함: 시나리오명·RUN-ID·환경·결과 카운트·소요시간·result.md 경로·신규 실패·연속 실패·권장 액션. **스크린샷 본문, DOM 덤프, 콘솔 로그 전체, 비밀번호·토큰 절대 포함 금지** (디스크에만).

## 타임아웃·실패 처리

- TC 1개 최대 60초, 시나리오 전체 최대 5분. 초과 시 `FAIL` + `note: "timeout"`.
- TC 가 실패해도 시나리오 끝까지 계속 진행 (조기 abort 금지). 후속 TC 가 실패한 TC 결과에 의존하면 `BLOCKED`.
- 시나리오 종료 시 페이지·컨텍스트 닫음.

## 환경별 안전장치

- **`prd` 환경 + 데이터 변경 시나리오**: 실행 전 메인 Claude 가 대표님께 명시적 재확인 요청.
- 시나리오는 환경 독립적으로 작성, URL·계정은 `environments/{env}.md` 에서 주입.
- dev 안정화 → stage → prd 순으로 확장.

## 작업 원칙

- **계획 → 실행** 순서. 시나리오 실행 요청을 받으면 RUN-ID·대상 시나리오·환경을 먼저 메인에서 확정한 뒤 Skill dispatch.
- 시나리오 실행 자체가 아닌 **인프라 변경** (Skill 절차, 템플릿, 폴더 구조) 은 코드 작업이므로 "계획 수립 → 동의 → 실행" 흐름을 지킬 것.
