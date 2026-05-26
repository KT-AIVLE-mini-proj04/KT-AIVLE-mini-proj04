#  도서관리 시스템 개발
AIVLE EDU 4차 미니 프로젝트로 진행된 AI 활용 도서 관리 단일 페이지 애플리케이션입니다. 
사용자가 도서 정보를 관리(CRUD)할 수 있으며, 도서 내용을 기반으로 OpenAI API를 호출하여 맞춤형 도서 표지를 자동으로 생성해 주는 핵심 기능을 포함하고 있습니다.

## 프로젝트 개요
* **[주제]:** 도서관리 시스템 개발과 AI를 활용한 도서표지 생성.
* **[진행기간]:** 3일
* **[프로젝트]:** 미니 프로젝트 4차
* **[플렛폼]:** AIVLE EDU
* **[주요목표]:** 
  1. React와 json-server를 활용한 RESTful API 통신 및 CRUD 구현
  2. OpenAI GPT Image 2 모델을 활용한 프롬프트 엔지니어링 및 외부 API 연동
  3. Base64 이미지 데이터 처리 및 부분 업데이트(PATCH) 적용

## 기술 스택
| 레이어 | 기술 스택 |
|---|---|
| **Frontend** | React 19, Vite, fetch API |
| **Mock Backend** | json-server (로컬 REST API) |
| **AI** | OpenAI API (GPT Image 2) |
| **UI 라이브러리** | MUI (Material UI) |
| **협업 및 배포** | GitHub, Vercel |
> **참고:** 현재 백엔드는 `json-server`를 활용한 Mock API로 구성되어 있으며, 추후 Spring Boot 기반의 실제 백엔드 서버로 교체될 예정입니다.

## 주요 기능 및 요구사항
* **도서 목록 조회:** 전체 도서의 제목과 등록일을 카드 또는 리스트 형태로 제공
* **도서 등록 (POST):** 제목 및 내용 입력란 제공 (공백 방지 유효성 검사 포함)
* **도서 상세 조회 (GET):** 생성된 AI 표지, 작성 / 수정일, 본문 내용 열람
* **도서 수정 (PATCH):** 기존 정보를 폼에 자동 로딩하고, 변경된 필드만 서버에 업데이트
* **도서 삭제 (DELETE):** 삭제 전 확인 알림(Confirm) 창 제공 및 목록 즉시 반영
* **AI 표지 생성:** 
  * 도서 본문 내용을 기반으로 프롬프트 생성 후 OpenAI 호출
  * 응답받은 `b64_json` 데이터를 Data URL(`data:image/png;base64,...`)로 변환
  * 변환된 이미지를 PATCH 메서드로 즉시 서버에 저장 및 화면 렌더링

## 서비스 흐름도
1. **Client (React SPA)** ↔ **Mock DB (json-server)**: `db.json`을 통한 도서 정보 CRUD 
2. **Client** → **OpenAI API**: 도서 내용을 바탕으로 표지 생성 요청 (`POST` + prompt)
3. **OpenAI API** → **Client**: Base64 인코딩된 이미지 데이터(`b64_json`) 반환
4. **Client** → **Mock DB**: Base64 데이터를 Data URL로 변환하여 표지 이미지 업데이트 (`PATCH /books/:id`)

##  실행 방법 (Getting Started)
로컬 환경에서 프로젝트를 실행하기 위한 방법입니다.
OpenAI API Key는 보안을 위해 코드에 하드코딩하지 않고, 실행 후 화면 UI를 통해 직접 입력받아 사용합니다.

### 설치 및 실행
1. 저장소를 클론합니다.
\`\`\`bash
git clone https://github.com/KT-AIVLE-mini-proj04/KT-AIVLE-mini-proj04.git
\`\`\`

2. 패키지를 설치합니다.
\`\`\`bash
cd KT-AIVLE-mini-proj04
npm install
\`\`\`

3. json-server 실행 (새 터미널 창을 열어서 실행)
가짜 REST API 서버를 포트 3001번에서 실행합니다.
\`\`\`bash
npx json-server --watch db.json --port 3001
\`\`\`

4. 개발 서버를 실행합니다.
\`\`\`bash
npm run dev
\`\`\`

##  팀원 및 역할
* **[심경민]**: [역할 - PM, 기획 - 과제 총괄 진행, 요구사항 정의, 기능 명세서 작성]
* **[유우식]**: [역할 - 발표,문서 - README.md 정리, 발표자료 작성, 데모 시연 준비]
* **[김현민]**: [역할 - 발표자 - CSS 마감, 반응형 대응, E2E 시나리오 테스트]
* **[김성준]**: [역할 - CRUD 연동 - 페이지 구조 설계, 공통 컴포넌트 제작, 전체 디자인 톤 관리]
* **[김창민]**: [역할 - OpenAI 연동 - GPT Image API 호출 및 응답 변환, API Key UI, 에러 · 로딩처리]
* **[노경천]**: [역할 - OpenAI 연동 - 과제 총괄 진행, 요구사항 정의, 기능 명세서 작성]
* **[박종호]**: [역할 - UI•레이아웃 - GPT Image API 호출 및 응답 변환, API Key UI, 에러 · 로딩처리]
* **[방리오]**: [역할 - 스타일링, QA - CSS 마감, 반응형 대응, E2E 시나리오 테스트]
* **[성현석]**: [역할 - 스타일링, QA - json-server 세팅, 목록/상세/등록/수정/삭제 API 연동]