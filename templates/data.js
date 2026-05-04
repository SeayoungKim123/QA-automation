// QA 자동화 대시보드 데이터 (빈 양식 / source of truth)
// 매 실행 후 메인 Claude 가 reports/data.js 를 이 스키마대로 덮어씁니다.
// 스키마 주체: templates/dashboard.html 내부 렌더링 JS.

window.QA_DATA = {
  meta: {
    // title_suffix: "(dev)",       // 선택. 헤더 타이틀 뒤에 붙는 부가 문구
    env: null,                       // "dev" | "stage" | "prd"
    run_id: null,                    // 예: "RUN-20260502-1430-dev"
    updated_at: null,                // 예: "2026-05-02 14:32"
  },

  kpis: {
    total_runs: 0,
    runs_by_env: "dev 0 · stage 0 · prd 0",
    pass_rate: null,                 // number(0-100). null 이면 "—" 회색 표시
    pass: null,                      // number. null 이면 "실행 후 표시" 유지
    fail: null,
    open_issues: null,               // number. null 이면 0 표기 유지
    issues_breakdown: null,          // 예: "P0 1 · P1 2"
    scenario_count: 0,
    tc_count: 0,
  },

  // 전체 시나리오·TC 카탈로그 (scenarios/*.md 의 전체) + 최근 회차 결과 오버레이.
  // 메인 Claude 가 매 실행 후 scenarios/ 폴더를 스캔해 빌드하고, 이번 회차 결과를 status 에 채움.
  // 파일명(=id) 오름차순 정렬 권장.
  // status: "PASS" | "FAIL" | "—" (미실행) — PASS/FAIL 이 아니면 회색 "—" 뱃지로 렌더됨.
  // pass: 이번 회차에서 PASS 한 TC 수, total: 시나리오 전체 TC 수 (실행 여부 무관).
  scenarios: [
    // {
    //   id: "01-회원가입",
    //   pass: 4,
    //   total: 5,
    //   tcs: [
    //     { id: "TC-01", name: "정상 가입",       tag: "",     status: "PASS" },
    //     { id: "TC-02", name: "중복 이메일",     tag: "",     status: "PASS" },
    //     { id: "TC-03", name: "비밀번호 정책",   tag: "신규", status: "FAIL" },
    //     { id: "TC-04", name: "인증 메일 재전송", tag: "",     status: "—"   },  // 미실행
    //   ],
    // },
  ],

  // 미해결 이슈 (FAIL 누적)
  issues: [
    // {
    //   priority: "P0",              // "P0" | "P1"
    //   scenario: "01-회원가입",
    //   tc: "TC-04",
    //   symptom: "이메일 인증 메일 미수신",
    //   first_seen: "2026-05-02",
    //   consecutive: "3",            // 연속 실패 횟수 (3 이상이면 강조 색)
    //   new: false,                  // true 시 "신규" 뱃지
    // },
  ],

  // 최근 실행 이력
  history: [
    // {
    //   run_id: "RUN-20260502-1430-dev",
    //   date: "2026-05-02 14:30",
    //   env: "dev",
    //   target: "회원가입",
    //   pass: 4,
    //   fail: 1,
    //   status_class: "warn",        // "pass" | "warn" | "fail"
    //   duration: "1m 42s",
    //   note: "",
    // },
  ],
};
