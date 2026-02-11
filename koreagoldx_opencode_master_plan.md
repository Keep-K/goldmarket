# KoreaGoldX — Opencode 전달용 단일 기획서 (A안: 공통 컨텍스트 1회 + 템플릿 단위 구현 + 핀포인트 수정)

> 이 문서는 **Opencode(코드 생성형 AI)** 에게 “한 번만” 전달하는 **단일 기준 문서**입니다.  
> 이후 작업은 이 문서를 **참조**하면서, 페이지/템플릿 단위로 **짧은 작업 지시**만 추가하면 됩니다.  
> (수정은 전체 재생성 금지, **핀포인트(diff/패치)** 로만 진행)

---

## 0) 프로젝트 요약

- **목표**: koreagoldx.co.kr 구조를 참고해 **홍보/안내용 웹사이트**로 재구축
- **결제 기능 없음**: 장바구니/주문/PG/회원/마이페이지/결제 버튼 전부 제거
- **시세 데이터**: 금/은/백금/국제/다이아 등은 **API 연동** (프론트 직결 금지, 중계 서버 권장)
- **프론트 스택**: Vite + React + TypeScript + React Router  
  - 데이터: TanStack Query 권장
- **이미지**: 전부 **Mock Asset 슬롯**으로 넣고, 추후 교체 가능하게 파일명 고정

---

## 1) Opencode 작업 원칙 (필수)

### 1-1. 출력/수정 규칙
- 최초 생성: 여러 파일 생성 가능
- **수정(반복) 시**:
  - 전체 파일 재출력 금지
  - **변경된 파일만** 출력
  - 가능하면 **unified diff** 또는 “변경 구간만” 패치 형태로 출력
- 모든 페이지는 **loading/error/empty** 상태 포함
- 접근성(ARIA/키보드 포커스/모달 포커스 트랩/ESC) 포함

### 1-2. CTA 정책(결제 없음)
- 상품 관련 CTA는 항상 3종으로 통일:
  1) **문의하기** (폼 이동 또는 섹션 스크롤)
  2) **전화하기** (tel:)
  3) **가맹점 찾기**
- “구매/결제/장바구니” 표현 사용 금지

### 1-3. 이미지/콘텐츠 정책
- 모든 이미지 경로는 Mock 슬롯 고정:
  - `src/assets/mock/...`
- 실제 이미지/텍스트는 추후 교체 가능하도록:
  - Mock 파일명 유지
  - CMS 도입 전까지는 JSON/MD fixture 또는 상수로 관리

---

## 2) IA / 라우트 트리 (최종)

- `/` Home
- `/prices` 시세 허브
  - `/prices/gold`
  - `/prices/silver`
  - `/prices/platinum`
  - `/prices/benchmark`
  - `/prices/live`
  - `/prices/diamond`
  - `/prices/lab-diamond`
  - `/prices/securities`
- `/products` 상품 허브
  - `/products/gold-bar`
  - `/products/silver-bar`
  - `/products/coins`
  - `/products/gifts`
  - `/products/diamond`
  - `/products/:id`
- `/stores` 가맹점 찾기
- `/refining` 정련(FTC)
- `/news`
  - `/news/:id`
- `/support` 고객센터 허브
  - `/support/notice`
    - `/support/notice/:id`
  - `/support/faq`
  - `/support/inquiry/product`
  - `/support/inquiry/general`
  - `/support/inquiry/corporate`
- `/about/company`
- `/about/history`
- `/about/office`
- `/about/organization`
- `/about/why`
- `/about/sell-guide`
- `/careers`
- `/franchise`
- `/legal/terms`
- `/legal/privacy`

---

## 3) 구현 우선순위 (권장)

1) **AppShell + 전역 CSS + 공통 UI 킷**
2) **PriceTemplate(차트+테이블)** → 가장 복잡
3) **ProductListTemplate / ProductDetail**
4) **Stores(지도 포함)**
5) **Support(Notice/FAQ/InquiryForm)**
6) News/About/Legal/Refining/Franchise/Careers (정적 위주)

---

## 4) 데이터/API (중계 서버 권장)

### 4-1. 권장 구조
`Frontend` → `Backend API(캐시/표준화)` → `외부 공급처`

### 4-2. 엔드포인트(예시)
- `GET /api/prices/spot?symbols=gold,silver,platinum&currency=KRW`
- `GET /api/prices/history?symbol=gold&range=1y&interval=1d`
- `GET /api/fx?pair=USDKRW`
- `GET /api/products?category=gold-bar&sub=ls&page=1&sort=price_desc&q=`
- `GET /api/products/:id`
- `GET /api/stores?region=seoul&q=`
- `GET /api/news?category=domestic&page=1&q=`
- `POST /api/inquiries`

### 4-3. 타입(최소)
- `PricePoint { t, open, high, low, close, volume? }`
- `SpotQuote { symbol, buy?, sell?, price, unit, currency, change?, changePct?, updatedAt, source }`
- `Product { id, name, category, subCategory?, priceLabel, soldOut, weight?, purity?, brand?, images[], specs: Record<string,string>, updatedAt }`
- `Store { id, name, region, address, phone, lat?, lng?, hours? }`
- `News { id, category, title, summary?, publishedAt, contentHtml }`
- `Inquiry { type, name, phone, email?, title, message, attachments? }`

---

## 5) 공통 레이아웃/전역 UIUX 규칙

### 5-1. Layout
- Header sticky + 스크롤 시 컴팩트 + 그림자
- Max width: `1200~1280px`, padding `16~24px`
- Grid: Desktop 12col / Tablet 8col / Mobile 4col
- Footer: 회사정보/바로가기/정책 링크

### 5-2. Navigation
- 메인 메뉴: `시세조회 / 상품 / 가맹점찾기 / 정련 / 뉴스 / 고객센터 / 회사소개`
- Breadcrumb: 리스트/상세 페이지에 표시
- Mobile: Drawer 메뉴

### 5-3. 상태
- Loading: Skeleton
- Error: 메시지 + 재시도
- Empty: 안내 + 필터 초기화/대체 CTA

### 5-4. 접근성
- 탭: `role="tablist"`, `aria-selected`
- 모달: focus trap + ESC 닫기
- 포커스 링 유지

---

## 6) DIV 구조 규칙 (AI 코드 생성 안정화)

### 6-1. App Shell
```jsx
<div id="app" className="app">
  <header className="header">
    <div className="container header__inner">
      <a className="header__logo" href="/">KoreaGoldX</a>
      <nav className="header__nav" aria-label="Primary">{/* links */}</nav>
      <div className="header__actions">{/* search/support/tel */}</div>
    </div>
  </header>

  <main className="main">
    <div className="page">{/* route */}</div>
  </main>

  <footer className="footer">
    <div className="container footer__inner">{/* info + links */}</div>
  </footer>

  <div id="portal-root" />
</div>
```

### 6-2. 섹션 패턴
```jsx
<section className="section">
  <div className="container">
    <header className="section__head">
      <h1 className="section__title">Title</h1>
      <p className="section__desc">Optional</p>
      <div className="section__actions">{/* buttons */}</div>
    </header>
    <div className="section__body">{/* content */}</div>
  </div>
</section>
```

### 6-3. Card 패턴
```jsx
<article className="card">
  <div className="card__media">{/* img */}</div>
  <div className="card__body">
    <h3 className="card__title">...</h3>
    <p className="card__meta">...</p>
    <div className="card__actions">{/* actions */}</div>
  </div>
</article>
```

---

## 7) 전역 CSS 설계 (tokens/base/layout/components/utilities)

### 7-1. 파일 구조
- `src/styles/tokens.css`
- `src/styles/base.css`
- `src/styles/layout.css`
- `src/styles/components.css`
- `src/styles/utilities.css`
- `src/styles/index.css`

### 7-2. tokens.css (예시)
```css
:root{
  --bg:#0b0f14; --fg:#e7edf5; --muted:#a8b3c2;
  --card:#101826; --border:rgba(255,255,255,.08);

  --brand:#d6b15e; --brand-2:#6fb1ff;
  --danger:#ff5a6a; --success:#2fd38a;

  --font-sans: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans KR", sans-serif;
  --fs-1: clamp(28px, 2.4vw, 40px);
  --fs-2: clamp(20px, 1.6vw, 28px);
  --fs-3: 18px; --fs-4: 16px; --lh: 1.5;

  --sp-1:6px; --sp-2:10px; --sp-3:14px; --sp-4:18px; --sp-5:24px; --sp-6:32px; --sp-7:48px;
  --r-1:10px; --r-2:14px; --r-3:18px;
  --shadow-1: 0 10px 30px rgba(0,0,0,.25);
}
```

### 7-3. base.css (예시)
```css
*{box-sizing:border-box;}
html,body{height:100%;}
body{margin:0;font-family:var(--font-sans);background:var(--bg);color:var(--fg);line-height:var(--lh);}
a{color:inherit;text-decoration:none;}
img{max-width:100%;display:block;}
button,input,select,textarea{font:inherit;color:inherit;}
:focus-visible{outline:2px solid var(--brand-2);outline-offset:2px;}
```

### 7-4. layout.css (예시)
```css
.container{max-width:1280px;margin:0 auto;padding:0 20px;}
.section{padding:var(--sp-7) 0;}
.section__head{display:flex;flex-direction:column;gap:10px;margin-bottom:18px;}
.section__title{font-size:var(--fs-2);margin:0;}
.section__desc{color:var(--muted);margin:0;}

.grid{display:grid;gap:16px;}
.grid--2{grid-template-columns:repeat(2,minmax(0,1fr));}
.grid--3{grid-template-columns:repeat(3,minmax(0,1fr));}
.grid--4{grid-template-columns:repeat(4,minmax(0,1fr));}
@media (max-width:1024px){.grid--4,.grid--3{grid-template-columns:repeat(2,minmax(0,1fr));}}
@media (max-width:640px){.grid--2,.grid--3,.grid--4{grid-template-columns:repeat(1,minmax(0,1fr));}}
```

### 7-5. components.css (예시)
```css
.card{background:var(--card);border:1px solid var(--border);border-radius:var(--r-2);box-shadow:var(--shadow-1);overflow:hidden;}
.card__body{padding:16px;display:flex;flex-direction:column;gap:10px;}
.card__title{margin:0;font-size:var(--fs-3);}
.card__meta{margin:0;color:var(--muted);font-size:14px;}

.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:10px 14px;border-radius:12px;border:1px solid var(--border);background:transparent;cursor:pointer;}
.btn--primary{background:var(--brand);color:#111;border-color:transparent;}
.btn--ghost{background:transparent;}
.badge{display:inline-flex;align-items:center;padding:4px 8px;border-radius:999px;background:rgba(255,255,255,.08);border:1px solid var(--border);font-size:12px;color:var(--muted);}
```

---

## 8) 공통 컴포넌트 목록(필수)

- `Header` (logo/nav/search/support/tel, mobile drawer)
- `Footer` (company info + links)
- `Breadcrumb`
- `Button / Card / Badge`
- `Tabs`
- `Modal` (search)
- `TableWrap`
- `Skeleton`
- `Toast` (form submit, errors)
- `FloatingCTA` (mobile)

---

## 9) 템플릿 설계 (핵심: 페이지별이 아니라 템플릿 단위)

### 9-1. PriceTemplate (공통)
**대상 라우트**: `/prices/*` 8종  
**필수 UI**
- 상단 탭바(8개)
- KPI 3~4개(현재가/변동/고저/단위)
- 차트(기간 프리셋: 5M/1Y/3Y/5Y/ALL, tooltip)
- 테이블(정렬/페이지네이션)
- 상담 안내 카드(문의/전화/지점)
- `/prices/live`만 auto-refresh 토글 + interval

**데이터**
- `GET /api/prices/spot`
- `GET /api/prices/history`

### 9-2. ProductListTemplate (공통)
**대상 라우트**: `/products/*` 카테고리 5종  
**필수 UI**
- Breadcrumb
- FilterBar (q/sort/pageSize/reset)
- Grid 카드(썸네일/이름/가격라벨/배지/상세보기)
- pagination + empty/error

### 9-3. ProductDetail (공통)
**대상 라우트**: `/products/:id`  
**필수 UI**
- 갤러리(확대 모달)
- 스펙 테이블
- 탭: 상세/구매방법/배송/교환/문의
- Sticky CTA(문의/전화/지점) + mobile sticky bar
- 관련 상품

### 9-4. StoresTemplate
**대상 라우트**: `/stores`  
- filter: region chips + q
- list + map(옵션)
- 전화/지도보기 CTA

### 9-5. Support Templates
- Notice List/Detail
- FAQ (검색 + accordion)
- InquiryForm (product/general/corporate) — 공통 컴포넌트로 변형

### 9-6. News Templates
- List + Detail(HTML render + share + related)

### 9-7. Static Section Page Template
- About/Legal/Refining/Careers/Franchise 등

---

## 10) Mock Asset 슬롯(최소)

- `src/assets/mock/hero/hero-01.jpg`
- `src/assets/mock/hero/hero-products.jpg`
- `src/assets/mock/banners/cat-gold.jpg`
- `src/assets/mock/banners/cat-silver.jpg`
- `src/assets/mock/banners/cat-coins.jpg`
- `src/assets/mock/banners/cat-gifts.jpg`
- `src/assets/mock/banners/cat-diamond.jpg`
- `src/assets/mock/products/p-0001.jpg` ... `p-0030.jpg`
- `src/assets/mock/about/office-01.jpg` ... `office-06.jpg`
- `src/assets/mock/news/n-0001.jpg` ... `n-0010.jpg`

---

## 11) 폴더 구조(권장)

```
src/
  app/
    App.tsx
    routes.tsx
  routes/
    home/
    prices/
    products/
    stores/
    refining/
    news/
    support/
    about/
    legal/
  components/
    layout/
    ui/
    domain/
  services/
    api/
      client.ts
      prices.ts
      products.ts
      stores.ts
      news.ts
      inquiries.ts
  styles/
    tokens.css
    base.css
    layout.css
    components.css
    utilities.css
    index.css
  assets/
    mock/
```

---

## 12) Opencode 프롬프트 운영 템플릿(짧게 쓰는 법)

### 12-1. “초기 1회” 컨텍스트 주입(예시)
- 이 문서 전체를 전달하고:
  - “이 문서를 기준으로 구현하라”
  - “수정은 diff로만”
  - “결제 없음/CTA 3종/Mock 이미지/전역 CSS 구조 유지”

### 12-2. 템플릿 구현 지시(예시: PriceTemplate)
- “PriceTemplate을 구현해라. 대상 라우트 8개, 요구 UI/데이터/상태는 9-1을 따른다.”
- “생성/수정된 파일만 출력”

### 12-3. 핀포인트 수정 지시(예시)
- “`routes/prices/PriceTemplate.tsx`에서 KPI 카드 4개로 확장”
- “차트 기간 버튼에 5M 추가”
- “변경된 부분만 diff로 출력”

---

## 13) 답변: 기존 다운로드 md 써도 되나?

- **가능**: 이전에 준 `koreagoldx_uiux_plan.md`를 그대로 써도 됩니다.
- 다만 A안 운영(1회 주입 + 템플릿 구현 + 핀포인트 수정) 관점에서는  
  **이 문서(전달/운영 규칙 포함)를 기준 문서로 쓰는 편이 더 효율적**입니다.

---

### End.
