# 📚 AI 도서관리 시스템

> AIVLE EDU 4차 미니 프로젝트 — AI 기반 도서 표지 자동 생성 기능을 탑재한 단일 페이지 도서 관리 애플리케이션

---

## 프로젝트 개요

| 항목 | 내용 |
|:---:|---|
| **주제** | 도서관리 시스템 개발 + AI 활용 도서 표지 생성 |
| **진행 기간** | 3일 |
| **차수** | 미니 프로젝트 4차 |
| **플랫폼** | AIVLE EDU |

### 주요 목표

1. **React + json-server** 기반 RESTful API 통신 및 CRUD 구현
2. **OpenAI GPT Image 2** 모델을 활용한 프롬프트 엔지니어링 및 외부 API 연동
3. **Base64 이미지 데이터** 처리 및 부분 업데이트(PATCH) 적용

---

## 기술 스택

| 레이어 | 기술 |
|:---:|---|
| **Frontend** | React 19, Vite, fetch API |
| **Mock Backend** | json-server (로컬 REST API) |
| **AI** | OpenAI API (GPT Image 2) |
| **UI 라이브러리** | MUI (Material UI) |
| **협업 / 배포** | GitHub, Vercel |

> 📌 현재 백엔드는 `json-server` 기반 Mock API이며, 추후 **Spring Boot** 실제 백엔드 서버로 교체 예정입니다.

---

## 폴더 구조

```
KT-AIVLE-mini-proj04
├── public/
├── src/
│   ├── assets/          # 이미지, 아이콘 등 정적 리소스
│   ├── common/          # 공통 유틸리티 함수, 상수 관리
│   ├── hooks/           # fetch API 연동 및 커스텀 훅
│   ├── screen/          # 페이지 컴포넌트 (목록, 상세, 등록, 수정)
│   ├── App.jsx          # 라우팅 및 전역 상태 레이아웃
│   ├── main.jsx         # 앱 진입점
│   └── index.css        # 전역 스타일 시트
├── db.json              # Mock API 로컬 데이터베이스
├── package.json         # 의존성 및 스크립트 설정
└── vite.config.js       # Vite 빌드 및 개발 서버 설정
```

---

## 주요 기능 명세

### 1. 도서 CRUD

| 기능 | 메서드 | 설명 |
|---|:---:|---|
| **목록 조회** | `GET` | 전체 도서를 카드/리스트 형태로 출력. 제목·등록일 표시 |
| **상세 조회** | `GET` | AI 표지, 작성/수정일, 본문 내용 열람 |
| **도서 등록** | `POST` | 제목·내용 입력 → 완료 시 목록 페이지로 자동 이동 |
| **도서 수정** | `PATCH` | 수정 버튼 클릭 → **별도 수정 페이지**로 이동, 기존 정보 자동 로딩. 업데이트 전 **"수정하시겠습니까?" 확인 메시지** 출력 |
| **도서 삭제** | `DELETE` | 삭제 전 **확인(Confirm) 알림** 제공, 삭제 후 목록 즉시 반영 |

### 2. 폼 유효성 검사

- 제목·내용 **필수 입력** 검증 (단순 공백 불허)
- **길이 제한** 적용

### 3. AI 표지 생성

| 항목 | 상세 |
|---|---|
| **옵션 선택 UI** | 생성 모델, 이미지 크기 등 파라미터를 사용자 UI에서 직접 선택 |
| **프롬프트 템플릿** | 도서 제목 + 저자 + 내용을 조합한 구조화된 프롬프트로 OpenAI 호출 |
| **API Key 입력** | 보안을 위해 코드에 하드코딩하지 않고, **UI를 통해 직접 입력** 방식 채택 |
| **상태 처리** | 로딩 스피너 + 에러 핸들링 + **비용 발생 안내 메시지** 표시 |
| **즉시 반영** | 응답받은 `b64_json`을 Data URL로 변환 → 상세 페이지에 즉시 렌더링 |
| **표지 저장** | 변환된 Data URL을 `PATCH /books/:id`로 DB에 영구 저장 |

### 4. 검색 및 필터

- GNB(Header) 영역에 **검색 바** 및 **필터 기능** 배치

### 5. 로딩 UX

- 데이터 Fetch 및 AI 이미지 생성 시 **로딩 스피너/메시지** 제공

---

## 서비스 흐름도

```
┌──────────────────┐       CRUD        ┌──────────────────┐
│                  │ ◄──────────────►  │                  │
│  Client          │   GET / POST /    │  Mock DB         │
│  (React SPA)     │   PATCH / DELETE  │  (json-server)   │
│                  │                   │  db.json         │
└────────┬─────────┘                   └──────────────────┘
         │
         │  POST (prompt)
         ▼
┌──────────────────┐
│  OpenAI API      │
│  (GPT Image 2)   │
│                  │
│  → b64_json 반환  │
└──────────────────┘
```

**상세 플로우:**

1. **Client ↔ Mock DB** — `db.json`을 통한 도서 정보 CRUD
2. **Client → OpenAI API** — 도서 내용 기반 표지 생성 요청 (`POST` + prompt)
3. **OpenAI API → Client** — Base64 인코딩 이미지 데이터(`b64_json`) 반환
4. **Client → Mock DB** — Data URL로 변환한 표지 이미지를 `PATCH /books/:id`로 저장

---

## 실행 방법

### 사전 요구 사항

- **Node.js** (v18 이상 권장)
- **npm** 또는 **yarn**
- **OpenAI API Key** (표지 생성 기능 사용 시 필요, UI에서 입력)

### 설치 및 실행

```bash
# 1. 저장소 클론
git clone https://github.com/KT-AIVLE-mini-proj04/KT-AIVLE-mini-proj04.git

# 2. 패키지 설치
cd KT-AIVLE-mini-proj04
npm install

# 3. json-server 실행 (새 터미널)
npx json-server --watch db.json --port 3001

# 4. 개발 서버 실행
npm run dev
```

> ⚠️ **OpenAI API Key**는 보안을 위해 소스코드에 포함하지 않습니다. 앱 실행 후 화면 UI를 통해 직접 입력해 주세요.
