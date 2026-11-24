# REFLOW — 디자인 시스템 & 작업 규칙
이 문서는 화면을 만들기 전에 따르는 시스템 기준입니다.
색·글자·간격, 카드와 버튼 구조, 화면 문구, 코드 작성 규칙을 정해 두었습니다.
작업은 Cursor에서 하고, 완성된 싱글 HTML은 Vercel에 올려 배포할 예정입니다.

## 1. 프로젝트 맥락

**REFLOW**는 ChatGPT, Claude, Gemini, Perplexity 등 여러 AI에 흩어진 대화를 **테마별 카드**로 모아,
어디까지 정했는지 확인하고 하던 대화로 바로 돌아갈 수 있게 해주는 **'대화 작업대'** 서비스다.
(대학원 '시스템과 사용자 경험' 7조 조별과제)

### 해결하려는 문제
- 과제·업무·여행 계획을 각각 다른 AI 창에서 묻다 보면 **어느 창에서 무슨 이야기를 했는지 잊는다.**
- 전에 찾은 답을 다시 찾거나, 같은 설명을 반복하게 된다.

### 핵심 키워드 → 디자인 원칙으로 번역

| 키워드 | 의미 | 화면에서 지키는 원칙 |
|---|---|---|
| 작업기억 | 한 번에 다룰 수 있는 정보량이 제한됨 | 카드 1장에 보이는 항목은 섹션당 최대 3줄. 넘치면 '더 보기'로 접는다. |
| 맥락 유지 | 여러 대화를 오가도 흐름과 결론을 잃지 않음 | 모든 카드가 같은 구조(확정 · 미정 · 다음 행동)를 쓴다. 순서를 바꾸지 않는다. |
| 외재적 인지부하 | 정보가 흩어진 방식 때문에 생기는 불필요한 부담 | 색·아이콘·장식으로 구분하지 않고 **위계(크기·굵기·여백)**로 구분한다. |
| 인지적 오프로딩 | 기억할 내용을 외부 도구(카드)에 맡김 | 카드만 보고 다음 행동을 알 수 있어야 한다. '다음 행동'은 항상 카드 하단에 둔다. |

### 핵심 기능 (MVP)

| 기능 | 설명 |
|---|---|
| 카드 요약 | 대화마다 **확정 · 미정 · 다음 행동**을 카드로 보여줌 |
| 근거 보기 | 요약 각 줄의 근거가 된 원문 메시지를 강조해 보여줌 |
| 요약 수정 | AI 요약을 사용자가 고치면 카드에 '사용자 수정'으로 표시 |
| 원본으로 이동 | '바로 가기'로 원래 대화 화면을 열어 이어서 작업 |

### 보조 기능

| 기능 | 설명 |
|---|---|
| 찾기 | 검색, AI별 필터, 최신 순 · 테마 순 정렬 (테마 순 안에서는 최신 순) |
| 요약 상태 표시 | 요약 초안 / 확인 필요 / 사용자 수정 |
| 두 가지 보기 | ① 채팅 화면 위에 여는 **패널** ② 모든 카드를 보는 **전체 작업대** |
| 원본 링크 연결 | 수정 화면에서 실제 대화 주소를 붙여 넣어 '바로 가기'와 연결 |

### 서비스 흐름
```
AI 채팅 중 REFLOW 열기 → 카드 찾기(검색·AI 필터·정렬) → 카드 열기(확정·미정·다음 행동)
→ 근거 보기로 원문과 비교 → (틀림) 요약 수정 → 카드로 복귀
                          → (맞음) 바로 가기 → 원래 대화에서 이어서 작업
```

### 산출물과 검증
- 시연용 프로토타입: `prototype.html` — **싱글 HTML 1개**, 교수님·원우가 직접 클릭해서 써볼 수 있어야 한다.
- 랜딩페이지: `index.html` — 서비스 소개와 프로토타입 바로 가기. 배포 주소의 첫 화면(`/`)이 된다.
- 검증 설계: 창 1개 · 3개 · 5개 조건에서 **일반 화면 vs 카드 화면** 비교.
  측정 지표는 ⏱ 이전 답을 찾는 시간, ❌ 잘못된 창에 질문한 횟수.
- 실험용 측정 기능(타이머, 클릭 기록 등)은 **요청이 있을 때만** 추가한다.

---

## 2. 디자인 토큰 (Figma 변수와 1:1 대응)

### 2-1. 규칙
1. 컴포넌트 CSS에서는 **시맨틱 토큰(`--color-*`)만** 쓴다. 프리미티브(`--indigo-*`, `--gray-*`)를 직접 쓰지 않는다.
2. `:root` 밖에서 **HEX·RGB 값을 직접 쓰지 않는다.**
3. 토큰에 없는 값이 필요하면 임의로 만들지 말고, 먼저 사용자에게 제안한다. 확정되면 **Figma 변수와 이 문서를 함께** 갱신한다.
4. CSS 변수 이름은 Figma 변수의 Code syntax와 같다. (Figma `primary/main` → `var(--color-primary-main)`)

### 2-2. 컬러 — 시맨틱 (Figma 컬렉션: `Color` / 모드: `Light`)

| Figma 변수 | CSS 변수 | 참조 | HEX | 용도 | 주의 |
|---|---|---|---|---|---|
| primary/main | `--color-primary-main` | indigo-900 | #241C4B | 헤더, 주요 버튼, 선택된 필터 칩 | 메인 컬러 |
| primary/sub | `--color-primary-sub` | indigo-600 | #554A99 | 링크, 포커스 링, 선택된 카드 테두리, 랜딩 제목 강조 | 흰 배경 7.4:1, bg/primary-faint 위 6.9:1. 장식용 강조는 **한 화면에 2곳까지** (7장) |
| primary/light | `--color-primary-light` | indigo-400 | #948DD9 | 보조 그래픽 요소 | **텍스트 금지** (대비 2.97:1) |
| primary/point | `--color-primary-point` | ochre-500 | #E4A339 | '미정' 표시점 | **텍스트 금지**, 다른 곳에 쓰지 않음 |
| text/primary | `--color-text-primary` | gray-900 | #1A1924 | 제목, 본문 | |
| text/secondary | `--color-text-secondary` | gray-600 | #5A5A64 | 보조 설명, 메타 정보 | 회색 배경 위에서도 OK (6.1:1) |
| text/tertiary | `--color-text-tertiary` | gray-500 | #72727B | 캡션, placeholder | **흰 배경 위에서만** (회색 배경 위 4.27:1로 미달) |
| text/disabled | `--color-text-disabled` | gray-400 | #A4A4AC | 비활성 상태 | 읽어야 하는 텍스트에 쓰지 않음 |
| text/status | `--color-text-status` | indigo-500 | #7166BC | 개수·상태값 강조 | 흰 배경 위에서만 |
| text/inverse | `--color-text-inverse` | gray-0 | #FFFFFF | 어두운 배경 위 텍스트 | |
| border/default | `--color-border-default` | gray-300 | #D2D2D8 | 입력창·버튼·칩 같은 조작 요소 테두리, 패널 가장자리 | |
| border/light | `--color-border-light` | gray-200 | #E6E6EB | 구분선, 카드·찾기 바 같은 큰 박스(1depth) 테두리 | |
| border/primary | `--color-border-primary` | indigo-200 | #D8D7F8 | 카드 hover 테두리, 근거 강조 테두리 | |
| bg/white | `--color-bg-white` | gray-0 | #FFFFFF | 카드, 패널 | |
| bg/gray | `--color-bg-gray` | gray-100 | #F2F2F6 | 페이지 배경, 섹션 박스 | |
| bg/primary-subtle | `--color-bg-primary-subtle` | indigo-100 | #EBEBFD | 근거 하이라이트, '사용자 수정' 배지 배경 | |
| bg/primary-faint | `--color-bg-primary-faint` | indigo-50 | #F6F6FF | 넓은 면 배경(랜딩 섹션 띠). 화면이 무채색으로 가라앉지 않게 브랜드 색을 아주 옅게 깐다 | **Figma 미등록**. text/tertiary 금지(4.43:1) |
| status/success | `--color-status-success` | green-700 | #1E7546 | 성공 메시지 | |
| status/success-bg | `--color-status-success-bg` | green-50 | #E3F8E9 | 성공 배경 | |
| status/warning | `--color-status-warning` | amber-700 | #9D580C | '확인 필요' 텍스트 | |
| status/warning-bg | `--color-status-warning-bg` | amber-50 | #FFEFDE | '확인 필요' 배경 | |
| status/error | `--color-status-error` | red-700 | #B33736 | 오류, 삭제 | |
| status/error-bg | `--color-status-error-bg` | red-50 | #FFEDEB | 오류 배경 | |

### 2-3. 그 밖의 토큰

| 구분 | 토큰 | 값 | 용도 | Figma 상태 |
|---|---|---|---|---|
| Radius | `--radius-1depth` | 8px | 가장 큰 박스: 카드, 패널, 섹션 박스 | 등록됨 (Radius 섹션) |
| Radius | `--radius-2depth` | 6px | 박스 안 요소: 버튼, 입력창, 필터 칩 | 등록됨 |
| Radius | `--radius-flag` | 4px | 작은 배지·태그 | 등록됨 |
| Spacing | `--space-1` ~ `--space-8` | 4 / 8 / 12 / 16 / 20 / 24 / 32 / 48px | 여백·간격 | **미등록 (제안값)** |
| Shadow | `--shadow-overlay` | 0 8px 24px rgba(36, 28, 75, 0.12) | **채팅 위 패널, 모달에만** | **미등록 (제안값)** |
| Focus | `--focus-ring` / `--focus-ring-offset` | 2px solid var(--color-primary-sub) / 2px | 키보드 포커스 | 미등록 (코드는 2-5에 포함) |

- 원형(`border-radius: 50%`)은 상태 표시점(dot)에만 쓴다.
- 8px보다 큰 radius, pill 형태 버튼은 쓰지 않는다.

### 2-4. 타이포그래피 (Figma `Typography` 섹션 기준)

폰트: **Pretendard** (CDN: `https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css`)
fallback: `-apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif`

| 스타일 | 굵기 | 크기 | 행간 | 용도 |
|---|---|---|---|---|
| Heading 1 | Bold 700 | 20px | 1.4 | 화면 제목 (작업대, 패널 제목) |
| Heading 2 | Bold 700 | 18px | 1.4 | 카드 상세 제목, 섹션 제목 |
| Heading 3 | Bold 700 | 16px | 1.4 | 카드 제목 |
| Body | Regular 400 | 14px | 1.4 | 본문, 요약 항목 |
| Body Link | Regular 400 + underline | 14px | 1.4 | 링크 (`--color-primary-sub`) |
| Body Bold | Bold 700 | 14px | 1.4 | 섹션 라벨 (확정·미정·다음 행동) |
| Body Reading | Regular 400 | 14px | **1.6** | 여러 줄로 읽는 문단 (원문 대화, 설명). **Figma 미등록** |
| Body Small | Regular 400 | 12px | 1.4 | 메타 정보 (AI 이름, 수정 시각) |
| Body Small Bold | Bold 700 | 12px | 1.4 | 배지, 태그 |
| Button Name | Bold 700 | 14px | 1.0 | 버튼 |

- 굵기는 Regular 400, Bold 700 두 가지만 쓴다.
- 12px은 메타 정보와 배지에만 쓴다. 읽어야 하는 문장에 쓰지 않는다.
- 행간 1.4는 한 줄짜리 UI(버튼, 라벨, 카드 항목)용이다. 세 줄 넘게 이어지는 한글 문단은 `--lh-reading`(1.6)을 쓴다.
- 글자 크기를 바꾸려면 **Figma Typography를 먼저 바꾸고** 이 표를 갱신한다. 코드에서만 따로 키우지 않는다.

### 2-5. `:root` 기준 코드 (프로토타입 `<style>` 맨 위에 그대로 둔다)

```css
:root {
  /* Primitives — 컴포넌트에서 직접 쓰지 않는다 */
  --indigo-50: #f6f6ff; --indigo-100: #ebebfd; --indigo-200: #d8d7f8; --indigo-300: #bab7ec;
  --indigo-400: #948dd9; --indigo-500: #7166bc; --indigo-600: #554a99; --indigo-700: #403679;
  --indigo-800: #2f265d; --indigo-900: #241c4b; --indigo-950: #110b2a;
  --gray-0: #ffffff; --gray-50: #f9f9fb; --gray-100: #f2f2f6; --gray-200: #e6e6eb; --gray-300: #d2d2d8;
  --gray-400: #a4a4ac; --gray-500: #72727b; --gray-600: #5a5a64; --gray-700: #41414c;
  --gray-800: #2a2a35; --gray-900: #1a1924; --gray-950: #0d0c15;
  --ochre-50: #fff3e4; --ochre-100: #fee3bf; --ochre-300: #f8bf6c; --ochre-500: #e4a339; --ochre-700: #976712;
  --green-50: #e3f8e9; --green-700: #1e7546;
  --amber-50: #ffefde; --amber-700: #9d580c;
  --red-50: #ffedeb; --red-700: #b33736;

  /* Semantic — 컴포넌트는 이것만 쓴다 */
  --color-primary-main: var(--indigo-900);
  --color-primary-sub: var(--indigo-600);
  --color-primary-light: var(--indigo-400);
  --color-primary-point: var(--ochre-500);
  --color-text-primary: var(--gray-900);
  --color-text-secondary: var(--gray-600);
  --color-text-tertiary: var(--gray-500);
  --color-text-disabled: var(--gray-400);
  --color-text-status: var(--indigo-500);
  --color-text-inverse: var(--gray-0);
  --color-border-default: var(--gray-300);
  --color-border-light: var(--gray-200);
  --color-border-primary: var(--indigo-200);
  --color-bg-white: var(--gray-0);
  --color-bg-gray: var(--gray-100);
  --color-bg-primary-subtle: var(--indigo-100);
  --color-bg-primary-faint: var(--indigo-50);
  --color-status-success: var(--green-700);
  --color-status-success-bg: var(--green-50);
  --color-status-warning: var(--amber-700);
  --color-status-warning-bg: var(--amber-50);
  --color-status-error: var(--red-700);
  --color-status-error-bg: var(--red-50);

  /* Radius */
  --radius-1depth: 8px;
  --radius-2depth: 6px;
  --radius-flag: 4px;

  /* Spacing (제안값 — Figma 미등록) */
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px;
  --space-5: 20px; --space-6: 24px; --space-7: 32px; --space-8: 48px;

  /* Elevation — 채팅 위 패널, 모달에만 */
  --shadow-overlay: 0 8px 24px rgba(36, 28, 75, 0.12);

  /* Focus */
  --focus-ring: 2px solid var(--color-primary-sub);
  --focus-ring-offset: 2px;

  /* Motion (2-6) */
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
  --ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
  --duration-press: 140ms;
  --duration-ui: 200ms;
  --duration-modal: 250ms;
  --duration-drawer: 320ms;
  --duration-toast: 400ms;

  /* Typography */
  --font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif;
  --fs-h1: 20px; --fs-h2: 18px; --fs-h3: 16px; --fs-body: 14px; --fs-small: 12px;
  --fw-regular: 400; --fw-bold: 700;
  --lh-base: 1.4; --lh-button: 1; --lh-reading: 1.6;
}
```

### 2-6. 모션 (`prototype.html` 구현 기준)

| 토큰 | 값 | 쓰는 곳 |
|---|---|---|
| `--duration-press` | 140ms | 버튼·칩 누름, hover |
| `--duration-ui` | 200ms | 테두리·배경 등 작은 상태 변화 |
| `--duration-modal` | 250ms | 모달 열고 닫기 |
| `--duration-drawer` | 320ms | 채팅 위 패널 열고 닫기 |
| `--duration-toast` | 400ms | 토스트 |
| `--ease-out` | cubic-bezier(0.23, 1, 0.32, 1) | 기본. 나타나는 움직임 |
| `--ease-in-out` | cubic-bezier(0.77, 0, 0.175, 1) | 자리를 옮기는 움직임 |
| `--ease-drawer` | cubic-bezier(0.32, 0.72, 0, 1) | 패널 |

- 움직임은 **상태가 바뀌었다는 것을 알릴 때만** 쓴다. 장식용 반복 애니메이션은 쓰지 않는다.
- 카드 hover에 떠오르기(translate, scale, shadow)는 쓰지 않는다. (4-1)
- 스크롤 등장 효과는 opacity와 16px 이내 이동만 쓴다.
- `prefers-reduced-motion: reduce`에서는 전환을 끄거나 opacity만 남긴다. 스크롤 연동 장면은 최종 상태를 정적으로 보여준다.

### 2-7. 다크 모드 (`prototype.html` 구현 기준)

`html[data-theme="dark"]`에서 **시맨틱 토큰만 다시 매핑**하고 프리미티브는 그대로 둔다. 컴포넌트 CSS는 바꾸지 않는다.

| 시맨틱 | 라이트 | 다크 | 주의 |
|---|---|---|---|
| primary/main | indigo-900 | indigo-300 | 위의 글자는 text/inverse(indigo-950), 10.0:1 |
| primary/sub | indigo-600 | indigo-400 | |
| primary/point | ochre-500 | ochre-300 | 여전히 '미정' 표시점에만 |
| text/primary · secondary | gray-900 · gray-600 | gray-50 · gray-400 | secondary 7.0:1 |
| text/tertiary | gray-500 | gray-500 | **다크 배경 대비 3.65:1로 AA 미달 → 다크에서는 읽어야 하는 텍스트에 쓰지 않는다** |
| text/status | indigo-500 | indigo-400 | 5.85:1 |
| bg/white · gray | gray-0 · gray-100 | gray-900 · gray-950 | |
| bg/primary-subtle | indigo-100 | indigo-950 | |
| border/default · light · primary | gray-300 · 200 · indigo-200 | gray-700 · 800 · indigo-700 | |
| shadow/overlay | rgba(36,28,75,.12) | rgba(0,0,0,.45) | |

- **정리할 것:** 다크의 상태색 6개(success · warning · error와 각 배경)는 지금 HEX를 직접 쓴다. 2-1 규칙에 맞추려면 프리미티브(예: `--green-300`, `--green-900`)로 옮긴 뒤 참조해야 한다.
- 랜딩(`index.html`)은 다크 모드를 지원하지 않는다.

### 2-8. 랜딩 전용 토큰 (`index.html`, Figma 미등록)

제품 화면 타이포(최대 20px)로는 랜딩 제목을 만들 수 없어 따로 둔다. **프로토타입 화면에는 쓰지 않는다.**

| 토큰 | 값 | 용도 |
|---|---|---|
| `--fs-display-1` | clamp(2.5rem, 1.2rem + 6.2vw, 7.25rem) | 히어로·마무리 제목 (1440px에서 약 110px) |
| `--fs-display-2` | clamp(1.875rem, 1.1rem + 3.2vw, 4rem) | 섹션 제목 |
| `--fs-display-3` | clamp(1.25rem, 1rem + 1.1vw, 1.875rem) | 항목 제목 |
| `--fs-lead` / `--fs-body-lg` | 17~21px / 16px | 리드 문단 / 랜딩 본문 |
| `--lh-display` | 1.08 | 큰 제목 행간 (자간 -0.03 ~ -0.04em) |
| `--color-bg-inverse` | indigo-900 | 강조 섹션 띠 배경 |
| `--color-text-inverse-secondary` | indigo-200 | 강조 띠 위 보조 글자 (11.2:1) |
| `--color-border-inverse` | indigo-700 | 강조 띠 위 구분선 |
| 큰 버튼 `.btn--lg` | 높이 48px, 글자 16px | 히어로·마무리의 주요 행동에만 |

---

## 3. 레이아웃

### 3-1. 두 가지 보기
| 보기 | 구조 | 규칙 |
|---|---|---|
| 채팅 위 패널 | 가짜 AI 채팅 화면 위 오른쪽에 열리는 패널 (폭 420px) | `--color-bg-white`, 왼쪽 1px `--color-border-default`, `--shadow-overlay`. 카드는 1열 목록. |
| 전체 작업대 | 상단 찾기 바 + 카드 그리드 | 페이지 배경 `--color-bg-gray`, 최대 폭 1200px 가운데 정렬, `grid-template-columns: repeat(auto-fill, minmax(320px, 1fr))`, 간격 `--space-4` |

- 기준 해상도는 1440 × 900이다.

| 구간 | 규칙 |
|---|---|
| 1200px 이상 | 패널이 열리면 채팅 본문을 밀어 'REFLOW' 버튼이 가려지지 않게 한다 |
| 1024px 이하 | 카드 그리드가 자동으로 2열 → 1열로 줄어든다 |
| 760px 이하 (모바일) | 1열. 채팅 왼쪽 목록을 숨기고, 화면 바깥 여백은 `--space-4`(16px) ~ 20px. 클릭 영역 최소 32 × 32px 유지 |
- 대시보드형 차트, 통계 위젯, KPI 카드는 만들지 않는다. 이 서비스는 대시보드가 아니라 **작업대**다.

### 3-2. 여백 원칙
- 카드 안쪽 여백: `--space-5` (20px)
- 카드 안 섹션 사이: `--space-4` (16px), 섹션 라벨과 항목 사이: `--space-2` (8px)
- 화면 바깥 여백: `--space-7` (32px)
- 구분은 선보다 **여백**을 먼저 쓴다. 선이 필요하면 `--color-border-light` 1px만 쓴다.

---

## 4. 컴포넌트

### 4-1. 요약 카드 (`.summary-card`)
구조는 모든 카드에서 같다. 순서를 바꾸지 않는다.

```
[메타]  AI 이름 · 테마 태그 · 수정 시각          [요약 상태 배지]
[제목]  Heading 3, 최대 2줄 말줄임
[확정]  ● 섹션 라벨(Body Bold) + 항목 최대 3줄
[미정]  ● 섹션 라벨 + 항목 최대 3줄
[다음 행동] ● 섹션 라벨 + 항목 최대 3줄
[액션]  근거 보기 · 요약 수정                      [바로 가기 →]
```

- 배경 `--color-bg-white`, 테두리 1px `--color-border-light`, radius `--radius-1depth`, 그림자 없음.
- 카드는 그림자가 아니라 연한 선과 '흰 카드 · 회색(또는 옅은 인디고) 배경'의 차이로 구분한다. 그림자는 떠 있는 패널·모달만의 신호로 남겨 둔다.
- hover: 테두리만 `--color-border-primary`로 바뀐다. 떠오르는 효과(translate, shadow)는 쓰지 않는다.
- 선택됨: 테두리 2px `--color-primary-sub`.
- 섹션 표시점(8px 원):
  - 확정 → `--color-primary-main`
  - 미정 → `--color-primary-point` (포인트 컬러는 이 표시점에만 쓴다)
  - 다음 행동 → `--color-primary-sub`
- 섹션 라벨 텍스트는 모두 `--color-text-primary`. 색은 표시점에만 쓴다.
- 항목이 비어 있으면 섹션을 숨기지 말고 "아직 없음"을 `--color-text-tertiary`로 보여준다.

### 4-2. 요약 상태 배지 (`.status-badge`)
Body Small Bold, 높이 22px, 좌우 여백 8px, radius `--radius-flag`.

| 상태 | data 값 | 배경 | 텍스트 |
|---|---|---|---|
| 요약 초안 | `draft` | `--color-bg-gray` | `--color-text-secondary` |
| 확인 필요 | `check` | `--color-status-warning-bg` | `--color-status-warning` |
| 사용자 수정 | `edited` | `--color-bg-primary-subtle` | `--color-primary-sub` |

### 4-3. 버튼 (`.btn`)
높이 40px(작은 버튼 32px), 좌우 여백 16px, radius `--radius-2depth`, Button Name 타이포.

| 종류 | 배경 | 텍스트 | 테두리 | 쓰는 곳 |
|---|---|---|---|---|
| Primary | `--color-primary-main` | `--color-text-inverse` | 없음 | 영역당 **1개만**: 패널·상세의 '바로 가기', 수정 화면 '저장' |
| Secondary | `--color-bg-white` | `--color-text-primary` | 1px `--color-border-default` | 카드 안 '바로 가기', '취소' |
| Text | 투명 | `--color-primary-sub` | 없음 | '근거 보기', '요약 수정', '더 보기' |

- 카드 그리드에서 카드마다 Primary 버튼을 반복하지 않는다. 카드 안 '바로 가기'는 Secondary다.
- hover: Primary는 opacity 0.9, Secondary는 배경 `--color-bg-gray`, Text는 밑줄.
- 비활성: 배경 `--color-bg-gray`, 텍스트 `--color-text-disabled`.

### 4-4. 찾기 바 (`.filter-bar`)
- 검색 입력: 높이 40px, 테두리 1px `--color-border-default`, radius `--radius-2depth`, placeholder `--color-text-tertiary`, focus 시 테두리 `--color-primary-sub`.
- AI 필터 칩: 높이 32px, radius `--radius-2depth`.
  - 꺼짐: 배경 `--color-bg-white`, 테두리 `--color-border-default`, 텍스트 `--color-text-secondary`
  - 켜짐: 배경 `--color-primary-main`, 텍스트 `--color-text-inverse`
- 정렬: '최신 순' / '테마 순' 두 개짜리 세그먼트. 선택된 쪽은 배경 `--color-primary-main` + 텍스트 `--color-text-inverse`. 테마 순일 때도 그룹 안에서는 최신 순.
- 결과 개수는 `--color-text-status`로 "카드 12개" 형태로 보여준다.

### 4-5. 근거 보기 (`.evidence`)
- 요약 항목을 누르면 원문 대화에서 근거 메시지를 강조한다.
- 강조: 배경 `--color-bg-primary-subtle`, 테두리 1px `--color-border-primary`, radius `--radius-2depth`.
- 강조된 메시지로 자동 스크롤하고, 다른 항목을 누르면 이전 강조를 지운다.

### 4-6. 요약 수정 (`.edit-form`)
- 확정 · 미정 · 다음 행동을 각각 여러 줄 입력으로 수정한다. 줄 추가·삭제가 가능하다.
- '원본 링크' 입력란에 실제 대화 주소를 붙여 넣으면 '바로 가기'와 연결한다. URL 형식이 아니면 입력란 아래에 `--color-status-error`로 "대화 주소를 확인해 주세요"를 보여준다.
- 저장하면 상태가 `edited`(사용자 수정)로 바뀐다.

### 4-7. AI 이름 표기
- AI는 **텍스트 라벨로만** 표기한다: ChatGPT, Claude, Gemini, Perplexity.
- 각 회사 로고나 브랜드 컬러를 쓰지 않는다. 모든 AI 라벨은 같은 스타일(Body Small, `--color-text-secondary`)이다.

### 4-8. 빈 상태 · 검색 결과 없음
- 일러스트·이모지 없이 문장 2줄 + 버튼 1개로 구성한다.
- 예: "조건에 맞는 카드가 없어요" / "필터를 줄이거나 다른 단어로 찾아보세요" + [필터 초기화]

---

## 5. 용어와 문구

### 5-1. 용어 사전 (화면 전체에서 이 단어만 쓴다)

| 쓰는 말 | 쓰지 않는 말 |
|---|---|
| 카드 | 요약카드, 노트, 메모 |
| 테마 | 카테고리, 분류, 폴더 |
| 확정 / 미정 / 다음 행동 | 결정사항 / 보류 / To-do |
| 근거 보기 | 원문 보기, 출처 보기 |
| 요약 수정 | 편집, 고치기 |
| 바로 가기 | 이동, 열기, 원본 열기 |
| 전체 작업대 | 대시보드, 홈 |
| 패널 | 사이드바, 팝업 |
| 요약 초안 / 확인 필요 / 사용자 수정 | AI 생성 / 검토 필요 / 수정됨 |

### 5-2. 문구 톤
- 버튼은 명사형으로 짧게: "바로 가기", "저장", "필터 초기화"
- 안내·오류 문장은 해요체: "저장했어요", "대화 주소를 확인해 주세요"
- UI 안에 이모지를 쓰지 않는다. (README의 이모지는 문서용이다.)

### 5-3. 더미 데이터
- AI 4종(ChatGPT, Claude, Gemini, Perplexity) × 테마 3종(과제, 업무, 여행)을 고루 섞는다.
- 카드 상태 3종(요약 초안, 확인 필요, 사용자 수정)이 모두 화면에 한 번 이상 보이게 한다.
- 데이터 형태:

```js
{
  id: "c01",
  title: "심리학 과제 주제 정하기",
  ai: "ChatGPT",              // ChatGPT | Claude | Gemini | Perplexity
  theme: "과제",               // 과제 | 업무 | 여행
  updatedAt: "2026-11-18T21:30",
  status: "draft",            // draft | check | edited
  confirmed: [{ text: "주제: 작업기억과 멀티태스킹", evidence: ["m3"] }],
  pending:   [{ text: "실험 참가자 수", evidence: ["m5"] }],
  next:      [{ text: "선행 논문 3편 찾기", evidence: ["m6"] }],
  messages:  [{ id: "m3", role: "user" | "ai", text: "..." }],
  sourceUrl: ""               // 요약 수정에서 연결
}
```

---

## 6. 접근성
- 텍스트 대비는 WCAG AA(4.5:1) 이상. 2-2 표의 '주의' 칸을 지킨다.
- 모든 버튼·칩·카드는 키보드로 이동·선택할 수 있다. 포커스는 `--focus-ring`으로 보인다. `outline: none`만 쓰고 대체 표시를 빼지 않는다.
- 클릭 영역은 최소 32 × 32px.
- 색만으로 상태를 구분하지 않는다. 상태 배지에는 항상 글자가 있다.
- 아이콘만 있는 버튼에는 `aria-label`을 단다.
- `prefers-reduced-motion: reduce`를 존중한다. (2-6)

---

## 7. 슬롭 디자인 금지 체크리스트

UI 코드를 만들기 전에 아래를 모두 통과해야 한다.

- [ ] 그라데이션 없음 (`linear-gradient`, `radial-gradient` 금지)
- [ ] 그림자는 `--shadow-overlay` 하나뿐이고, 패널·모달에만 썼다
- [ ] 기본 파랑 버튼(#007bff, #3b82f6 계열 + 흰 글씨) 없음
- [ ] radius는 8 / 6 / 4px 세 가지만 썼다. pill 버튼 없음
- [ ] 아이콘은 의미가 있는 곳(검색, 닫기, 바로 가기 화살표)에만. 장식용 아이콘 없음
- [ ] 차트·통계 위젯으로 채운 화면 없음
- [ ] 글래스모피즘(blur 배경), 네온, 이모지 없음
- [ ] 포인트 컬러(#E4A339)는 '미정' 표시점에만 썼다
- [ ] `:root` 밖에 HEX 값 없음
- [ ] 장식용 강조색(primary-sub)은 한 화면에 2곳까지. 링크·포커스처럼 기능으로 쓰는 색은 세지 않는다. 보라 강조를 여기저기 뿌리면 대표적인 AI 티가 난다
- [ ] "X가 아니라 Y" 같은 대비 문장은 페이지에 1번만 쓴다
- [ ] 섹션마다 같은 모양의 보조 라벨을 붙이지 않는다
- [ ] 요약 항목을 한 줄 말줄임으로 자르지 않는다 (2줄까지 보이기)

**검사 도구:** [Open Design Agent Kit](https://github.com/feimacode/open-design-agent-kit)를 `.cursor/mcp.json`으로 연결해 두었다. 키트의 반드시 고칠 규칙 7개(Tailwind 기본 보라, 히어로 그라데이션, 이모지 아이콘, 왼쪽 색 테두리 카드, 지어낸 수치, 채움 문구 등)와 AI 티 자동 검사 5종도 통과해야 한다.

**선언 규칙:** UI 코드를 생성하기 전에 반드시 한 줄로 선언한다.
> "이 UI에서 슬롭 디자인을 피하기 위해 X로 처리했습니다."

---

## 8. 코드 규칙

### 8-1. 파일 구조 (싱글 HTML)
```
<head>  Pretendard CDN → <style>
          1) :root 토큰  2) reset·base  3) layout  4) components  5) states
<body>  마크업 (채팅 화면 + 패널 + 전체 작업대)
<script>
          1) 더미 데이터  2) 상태(state)  3) 렌더 함수  4) 이벤트 연결
```
- 프레임워크·빌드 도구 없이 vanilla HTML/CSS/JS로 만든다. 외부 리소스는 Pretendard CDN만 쓴다.
- 파일 하나만 열어도 동작해야 한다. (서버 없이 더블클릭으로 실행)
- 파일 이름은 영문 소문자로 쓴다: `index.html`(랜딩), `prototype.html`(프로토타입).

### 8-2. 이름 규칙
- 클래스는 BEM: `.summary-card`, `.summary-card__title`, `.summary-card--selected`
- 상태는 data 속성: `data-status="draft|check|edited"`, `data-view="panel|workspace"`
- JS 함수는 동사로 시작: `renderCards()`, `openEvidence(id)`, `saveSummary(id)`

### 8-3. 작성 원칙
- 수정은 **필요한 범위만** 바꾼다. 요청하지 않은 리팩터링·파일 분리를 하지 않는다.
- 과한 추상화(범용 유틸, 클래스 계층)를 만들지 않는다. 주변 코드 관례를 따른다.
- 주석은 코드만 봐서 알기 어려운 규칙에만 단다. (예: "테마 순 정렬 시 그룹 안은 최신 순")
- 테스트는 요청받았을 때만 작성한다.

### 8-4. Git
- 커밋·푸시는 **요청받았을 때만** 한다. 애매하면 먼저 확인한다.
- git config를 바꾸지 않는다. force push, hard reset 같은 되돌릴 수 없는 명령을 쓰지 않는다.
- `--no-verify` 같은 훅 건너뛰기 옵션을 쓰지 않는다.

---

## 9. 에이전트 응답 방식
작업 규칙이라 `.cursor/rules/agent-response.mdc`로 옮겼다.
