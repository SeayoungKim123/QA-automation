# 01-회원가입 — 실행 결과

**RUN-ID**: RUN-20260502-1430-dev
**환경**: dev
**시간**: 14:30:00 ~ 14:31:42 (1m 42s)
**결과**: ⚠️ 4 Pass / 1 Fail

## 사용자 흐름
이메일 입력 → 인증코드 발송 → 코드 확인 → 비밀번호 설정 → 가입 완료

---

## TC-01: 정상 가입 — ✅ PASS
- 입력: `qa+001@gabia.com`, 비밀번호 12자리
- 단계별 검증:
  1. 가입 화면 진입 ✓
  2. 인증코드 메일 수신 (3초 내) ✓
  3. 코드 입력 후 비밀번호 화면 이동 ✓
  4. 가입 완료 후 `/welcome` 리다이렉트 ✓
- 스크린샷: `screenshots/signup-tc01-step1.png` ~ `screenshots/signup-tc01-step4.png`

## TC-02: 중복 이메일 차단 — ✅ PASS
- 입력: `qa+001@gabia.com` (이미 가입됨)
- 결과: "이미 가입된 이메일입니다" 메시지 표시 ✓
- 스크린샷: `screenshots/signup-tc02-duplicate.png`

## TC-03: 비밀번호 정책 위반 차단 — ✅ PASS
- 입력: 비밀번호 `1234`
- 결과: "8자 이상, 영문+숫자 조합" 메시지 + 제출 차단 ✓
- 스크린샷: `screenshots/signup-tc03-policy.png`

## TC-04: 인증 메일 재전송 — ❌ FAIL (2회 연속)
- 입력: `qa+002@gabia.com` 가입 시도 → "재전송" 버튼 클릭
- **기대**: 새 인증코드 메일 수신
- **실제**: 60초 대기 후에도 메일 미수신, 버튼 클릭 후 화면 변화 없음
- 최초 발견: RUN-20260501-0930-dev
- 추정 원인: 메일 발송 큐 또는 SMTP 설정 이슈
- 스크린샷: `screenshots/signup-tc04-resend-click.png`, `signup-tc04-no-mail.png`
- 콘솔 로그: `429 Too Many Requests` (스크린샷 첨부)

## TC-05: 인증 링크 만료 처리 — ✅ PASS
- 입력: 30분 경과한 인증 링크 클릭
- 결과: "인증 링크가 만료되었습니다" 안내 + 재전송 옵션 노출 ✓
- 스크린샷: `screenshots/signup-tc05-expired.png`

---

## 정책 참조
- `specs/회원약관.md`
- `specs/비밀번호정책.md`
