# QA 자동화 계획서

**작성일**: 2026-05-02
**작성자**: PM (Gabia) + Claude

---

## 1. 배경

- 회사에 별도 QA팀이 없음 → PM이 출시 전 기능 테스트를 단독 수행해야 함
- 반복 작업을 줄이기 위해 AI에게 테스트 실행을 위임하는 구조를 구축
- 대표님은 자연어로 시나리오만 작성, 실제 브라우저 조작·검증·리포트는 Claude가 담당

---

## 2. 확정 사항

| 항목 | 내용 |
|---|---|
| 테스트 유형 | 핵심 시나리오 검증 (Critical Path) |
| 대상 | 웹 서비스 |
| 접근 방식 | 블랙박스 (소스코드 미접근, 화면만으로 검증) |
| 환경 | dev → stage → prd, **dev부터 시작** |
| 입력 자료 | 기획서, 정책서 보유 |
| AI 실행 방식 | Claude가 브라우저 직접 조작 (클릭·입력·스크린샷) |

---

## 3. 도구 구성

- **Claude Code** — AI 두뇌 (시나리오 해석, 실행 판단, 리포트 작성)
- **Playwright MCP** — Claude가 실제 브라우저를 띄우고 조작할 수 있게 해주는 다리
- **자연어 시나리오 (.md)** — 핵심 자산, 대표님이 직접 작성

> 코드는 거의 작성하지 않음. 대표님은 시나리오만 자연어로 적으면 됩니다.

---

## 4. 단계별 로드맵

### 1단계 — 환경 세팅 (1회, 약 30분)
- Node.js 설치 확인
- Playwright MCP 서버 등록
- 폴더 구조 생성

### 2단계 — 테스트 대상 정의
- dev URL, 테스트 계정 정리
- 출시 전 필수 통과 시나리오 N개 목록화

### 3단계 — 시나리오 문서화
- 자연어 시나리오를 `scenarios/*.md` 로 저장
- **시나리오 1개 = 사용자 흐름 1개 + 그 안의 테스트 케이스 N개** (한 파일 통합형)
- 예: `01-회원가입.md` 안에 흐름 + TC-01(정상), TC-02(중복이메일), TC-03(비밀번호 정책 위반) ...

### 4단계 — AI 자동 실행
- 메인 Claude 가 오케스트레이터 (RUN-ID 생성, 시나리오 dispatch, 집계)
- 시나리오마다 **`/qa-run` Skill (`context: fork`)** 호출 → 격리된 컨텍스트에서 실행
- Skill 안에서 Playwright 로 브라우저 조작, TC 끝날 때마다 `progress.jsonl` **즉시 append**
- 시나리오 종료 시 `result.md` 작성, 메인에 요약만 반환

### 5단계 — 결과 리포트
- 통과/실패/이슈를 `.md` 또는 HTML로 정리
- 개발팀에 그대로 전달 가능한 형태

---

## 5. 폴더 구조

```
QA-automation/
├── specs/                 ← 기획서·정책서 등 참고 자료 원본
├── scenarios/             ← 자연어 테스트 시나리오 (핵심 자산)
│   ├── _template.md
│   ├── 01-회원가입.md
│   └── ...
├── environments/          ← 환경별 URL·계정 정보
│   ├── dev.md
│   ├── stage.md
│   └── prd.md
├── reports/               ← 테스트 실행 결과
│   ├── STATUS.md          ← 텍스트 현황판 (항상 최신)
│   ├── dashboard.html     ← 시각 대시보드 (브라우저)
│   ├── HISTORY.md         ← 시계열 실행 로그
│   └── RUN-{YYYYMMDD-HHMM-환경}/
│       ├── summary.md
│       ├── 01-회원가입_result.md
│       └── screenshots/
├── PLAN.md                ← 본 문서
└── README.md              ← 사용 매뉴얼
```

---

## 6. 실행 이력 관리 (3계층 구조)

| 레벨 | 파일 | 역할 | 갱신 시점 |
|---|---|---|---|
| **현황판** | `reports/STATUS.md` | 누적 통계·진행도·통과율을 한 화면에 (텍스트) | 매 실행 후 덮어쓰기 |
| **시각 대시보드 (구조)** | `reports/dashboard.html` | KPI·시나리오·TC·이슈·이력 표시 — 정적 구조 + 렌더링 JS | 거의 변경 X (구조 개편 시만) |
| **시각 대시보드 (데이터)** | `reports/data.js` | `window.QA_DATA = {...}` 형태의 회차 데이터 | 매 실행 후 덮어쓰기 |
| **시계열 로그** | `reports/HISTORY.md` | 회차별 한 줄씩 append | 매 실행 후 추가 |
| **개별 상세** | `reports/{RUN-ID}/` | 그 회차의 스크린샷·실패 로그 | 실행 시 신규 생성 |

**RUN ID 규칙**: `RUN-YYYYMMDD-HHMM-{환경}`  예: `RUN-20260502-1430-dev`

**시각화 정책**: `dashboard.html` 은 구조만 담는 정적 자산이고, 매 실행 후 메인 Claude 가 갱신하는 것은 `data.js` 한 파일뿐.

**source of truth**: 빈 양식 일체는 `templates/` 가 source of truth (추적 O).
- `templates/dashboard.html` · `templates/STATUS.md` · `templates/HISTORY.md`
- `reports/` 는 전체 ignore (휘발성). 첫 실행 또는 파일 누락 시 메인 Claude 가 `templates/` → `reports/` 로 복사 후 `data.js` 생성.

**양식 미리보기**: `_sample/reports/` 참조 (self-contained, 추적 O).

**보조**: 각 시나리오 파일 하단에 "최근 실행 결과" 표를 자동 갱신 → 시나리오 단위 즉답.

---

## 7. 실행 아키텍처 (Skill + context: fork)

### 격리 단위
**시나리오 단위**로 격리. 시나리오 1개 = fork 1개. 첫 실행 후 다음 3가지 기준으로 재평가:
1. fork 안 컨텍스트 비대 여부
2. TC 간 dirty state 영향 여부
3. 사전조건(로그인 등) 공유로 얻는 시간 이득 vs 격리 손실

### 흐름
```
대표님: "회원가입 시나리오 dev에서 실행해줘"
   │
   ▼
[메인 Claude · 오케스트레이터]
   - RUN-ID 생성 (RUN-YYYYMMDD-HHMM-{env})
   - reports/{RUN-ID}/ 생성, progress.jsonl 초기화
   - 시나리오마다 ↓ Skill 호출
   ▼
[/qa-run · Skill, context: fork]   ← 격리 컨텍스트
   - scenarios/{시나리오}.md, environments/{env}.md 읽음
   - Playwright MCP 로 브라우저 조작
   - TC 끝날 때마다 progress.jsonl 1줄 append (즉시 기록)
   - 시나리오 종료 시 {시나리오}_result.md 작성
   - 메인에 요약만 반환 (Pass/Fail 카운트, 신규 실패, 권장 액션)
   ▼
[메인 Claude · 마무리]
   - HISTORY.md append, STATUS.md 덮어쓰기, dashboard.html 덮어쓰기
   - 각 시나리오 파일 하단 "최근 실행 결과" 표 갱신
```

### 즉시 기록 포맷 (`progress.jsonl`)
TC 종료 시점에 1줄씩 append. 중간 끊겨도 직전까지 결과 보존.

```json
{"ts":"2026-05-02T14:30:42","run_id":"RUN-20260502-1430-dev","scenario":"01-회원가입","tc":"TC-01","result":"PASS","duration_ms":3200,"screenshot":["screenshots/signup-tc01-step1.png"],"note":""}
```

`result` 가능 값: `PASS` / `FAIL` / `SKIP` / `BLOCKED` (선행 TC 의존 실패)

### Skill 정의 위치
`.claude/skills/qa-run.md` (프로젝트 단위)

---

## 8. 다음 단계 — 대표님 입력이 필요한 항목

### ① 기획서·정책서 전달 방법
- (A) `specs/` 폴더에 파일 직접 복사 (PDF/DOCX/MD 가능)
- (B) Notion·Confluence 외부 링크
- (C) 일부 발췌 후 채팅으로 전달

### ② dev 환경 정보
- dev URL
- 테스트 계정 (ID/PW)
  - ⚠️ 비밀번호는 채팅 대신 `environments/dev.md` 에 직접 작성 권장 (대화 로그 노출 방지)
- 계정이 없다면 → "가입" 시나리오에 포함

### ③ 핵심 시나리오 후보 키워드
- 머릿속에 떠오르는 흐름 (예: 회원가입, 결제, 게시물 작성 등)
- 키워드만 주시면 정리는 제가 진행

---

## 9. 진행 원칙

- **계획 → 실행** 순서 유지 (먼저 실행하지 않음)
- 환경별 단계 확장: dev 안정화 → stage → prd
- 시나리오는 환경 독립적으로 작성 (URL·계정만 environments/ 에서 주입)
- 실패 케이스는 스크린샷과 함께 보존

---
