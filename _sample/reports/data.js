// QA 자동화 대시보드 — 샘플 데이터
// 실제 환경에서는 매 실행 후 메인 Claude(오케스트레이터)가 이 파일을 덮어씁니다.
// 스키마는 dashboard.html 의 렌더링 JS 에서 소비하는 형태와 일치합니다.

window.QA_DATA = {
  meta: {
    title_suffix: "(샘플)",
    run_id: "RUN-20260502-1430-dev",
    env: "dev",
    updated_at: "2026-05-02 14:35"
  },

  kpis: {
    total_runs: 5,
    runs_by_env: "dev 5 · stage 0 · prd 0",
    pass_rate: 75,
    pass: 9,
    fail: 3,
    open_issues: 3,
    issues_breakdown: "P0 2건 · P1 1건",
    scenario_count: 4,
    tc_count: 15
  },

  scenarios: [
    {
      id: "01-회원가입",
      pass: 4,
      total: 5,
      tcs: [
        { id: "TC-01", name: "정상 가입", status: "PASS", tag: "" },
        { id: "TC-02", name: "중복 이메일 차단", status: "PASS", tag: "" },
        { id: "TC-03", name: "비밀번호 정책 위반 차단", status: "PASS", tag: "" },
        { id: "TC-04", name: "인증 메일 재전송", status: "FAIL", tag: "2회 연속" },
        { id: "TC-05", name: "인증 링크 만료 처리", status: "PASS", tag: "" }
      ]
    },
    {
      id: "02-로그인",
      pass: 3,
      total: 3,
      tcs: [
        { id: "TC-01", name: "정상 로그인", status: "PASS", tag: "" },
        { id: "TC-02", name: "잘못된 비밀번호 차단", status: "PASS", tag: "" },
        { id: "TC-03", name: "5회 실패 시 계정 잠금", status: "PASS", tag: "" }
      ]
    },
    {
      id: "03-결제",
      pass: 2,
      total: 4,
      tcs: [
        { id: "TC-01", name: "신용카드 정상 결제", status: "PASS", tag: "" },
        { id: "TC-02", name: "결제 한도 초과", status: "PASS", tag: "" },
        { id: "TC-03", name: "카드 거절 처리", status: "FAIL", tag: "3회 연속" },
        { id: "TC-04", name: "결제 취소 후 상태 반영", status: "FAIL", tag: "신규" }
      ]
    },
    {
      id: "04-마이페이지",
      pass: 0,
      total: 3,
      tcs: [
        { id: "TC-01", name: "프로필 정보 수정", status: "—", tag: "" },
        { id: "TC-02", name: "비밀번호 변경", status: "—", tag: "" },
        { id: "TC-03", name: "계정 탈퇴", status: "—", tag: "" }
      ]
    }
  ],

  issues: [
    {
      priority: "P0",
      scenario: "03-결제",
      tc: "TC-04",
      symptom: "결제 취소 후 상태가 '결제완료'로 잔존",
      new: true,
      first_seen: "RUN-20260502-1430",
      consecutive: "1회"
    },
    {
      priority: "P0",
      scenario: "03-결제",
      tc: "TC-03",
      symptom: "카드 거절 시 무한 로딩, 에러 페이지 미노출",
      new: false,
      first_seen: "RUN-20260430-1100",
      consecutive: "3회"
    },
    {
      priority: "P1",
      scenario: "01-회원가입",
      tc: "TC-04",
      symptom: "인증 메일 재전송 시 메일 미수신",
      new: false,
      first_seen: "RUN-20260501-0930",
      consecutive: "2회"
    }
  ],

  history: [
    { run_id: "RUN-20260502-1430-dev", date: "05-02 14:30", env: "dev", target: "전체 3건", pass: 9,  fail: 3, status_class: "warn", duration: "4m 25s", note: "결제 TC-04 신규 fail" },
    { run_id: "RUN-20260501-1645-dev", date: "05-01 16:45", env: "dev", target: "결제만",   pass: 2,  fail: 2, status_class: "fail", duration: "1m 11s", note: "결제 미해결 확인" },
    { run_id: "RUN-20260501-0930-dev", date: "05-01 09:30", env: "dev", target: "전체 3건", pass: 9,  fail: 3, status_class: "warn", duration: "4m 33s", note: "회원가입 TC-04 신규 회귀" },
    { run_id: "RUN-20260430-1100-dev", date: "04-30 11:00", env: "dev", target: "전체 3건", pass: 10, fail: 2, status_class: "warn", duration: "4m 18s", note: "결제 TC-03 신규 회귀" },
    { run_id: "RUN-20260428-1015-dev", date: "04-28 10:15", env: "dev", target: "회원가입", pass: 5,  fail: 0, status_class: "pass", duration: "1m 42s", note: "baseline 통과" }
  ]
};
