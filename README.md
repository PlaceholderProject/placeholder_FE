# 📌 Placeholder – 모두의 모임 플랫폼

[사진 첨부]

> **배포 URL** : [https://place-holder.site](https://place-holder.site)
> <br>
> **Test ID** : [테스트 계정 ID]
> <br>
> **Test PW** : [테스트 계정 비밀번호]

<br>

## ✨ 프로젝트 소개

**Placeholder**는 누구나 자신의 모임을 만들고 함께할 사람들을 찾을 수 있는 **커뮤니티 플랫폼**입니다.

- **모임 개설 및 참여**: 관심 주제별 모임을 만들고 홍보하거나, 다른 모임을 검색하고 참여 신청을 할 수 있습니다.
- **스케줄 관리**: 모임 내에서 일정을 생성하고 수정할 수 있으며, 각각의 스케줄 내에서 사진을 올려 멤버들과 소통할 수 있습니다.
- **내 공간**: 가입한 모임, 개설한 광고, 받은/보낸 신청서 등을 개인 공간에서 관리합니다.
- **소통 및 알림**: 모임별 일정 생성, 좋아요, 댓글로 소통하고 주요 활동에 대한 실시간 알림을 제공합니다.

<br>

## 🚀 주요 기능

- **🪪 계정 관리**: 회원가입, 로그인, 프로필 수정 등 기본적인 계정 관리를 할 수 있습니다.
- **📝 관심사 기반 모임 개설 및 광고**: 사용자가 원하는 주제로 모임을 만들고 광고할 수 있습니다.
- **🔍 모임 검색 및 필터**: 카테고리, 인기순, 최신순으로 모임을 쉽게 찾고 필터링할 수 있습니다.
- **📅 스케줄 관리**: 모임별로 약속을 잡고 구성원들과 공유하고 지도를 통해 스케줄의 위치를 확인할 수 있습니다.
- **🔔 실시간 알림**: 모임 신청 결과, 새 댓글 활동을 알려줍니다.
- **📝 내 공간**: 내가 가입/개설한 모임, 주고받은 신청서를 한곳에서 관리합니다.

<br>

## 🛠️ 기술 스택 및 개발 환경

### Front-end

- **Core**: `Next.js (App Router)`, `React`, `TypeScript`
- **State Management**: `tanstack query`, `Redux Toolkit`
- **Styling**: `TailwindCSS`
- **Code Quality**: `Prettier`, `ESLint`

### Back-end

- **Framework**: `Django Ninja`

### 배포 및 협업

- **Deployment**: `Vercel`
- **Collaboration**: `GitHub`, `Jira`, `Notion`, `Figma`

<br>

## 🔧 핵심 개발 전략

### 1. Next.js App Router

- **선언적 라우팅**: `app` 디렉토리 기반의 파일 시스템 라우팅으로 직관적인 페이지 구조를 구현했습니다.
- **레이아웃 관리**: 중첩 레이아웃과 라우트 그룹 `(auth)`, `(root)`을 활용해 인증 여부에 따라 헤더/네비게이션 바 등 UI를 분리 적용했습니다.
- **성능 최적화**: `SSR`을 적극 활용, robot.txt를 이용해 초기 로딩 속도 개선 및 SEO를 강화했습니다.

### 2. 효율적인 상태 관리

- **TanStack Query (Server State)**: 데이터 패칭, 캐싱, 동기화를 자동화하여 로딩 및 에러 상태 관리를 단순화했습니다. `invalidateQueries`를 통해 데이터 변경 시 UI를
  즉각적으로 업데이트합니다.
- **Redux Toolkit (Client State)**: 로그인 정보, UI 상태(모달 등)와 같이 전역적으로 유지되어야 하는 상태를 관리합니다. `redux-persist`로 새로고침 시에도 상태를
  보존합니다.

### 3. 유틸리티-퍼스트 스타일링

- **TailwindCSS**: 미리 정의된 유틸리티 클래스를 조합하여 별도의 CSS 파일 없이 빠르고 일관된 UI를 구축했습니다. `prettier-plugin-tailwindcss`로 클래스 순서를 자동
  정렬하여 가독성을 높였습니다.

### 4. Git-Flow 브랜치 전략

- `main`: 프로덕션 배포 브랜치
- `dev`: 통합 및 테스트 브랜치
- `feature/[기능]`: 기능 단위 개발 브랜치
- **프로세스**: `feature` → `dev`으로 PR(Pull Request) 후 병합하는 방식으로 충돌을 최소화했습니다.

<br>

## 📁 프로젝트 구조

```
├── public/
└── src/
├── app/
│   ├── (providers)/
│   │   ├── (root)/
│   │   │   ├── ad/
│   │   │   ├── my-space/
│   │   │   ├── meetup/
│   │   │   └── ... (페이지 라우트)
│   │   └── _providers/
│   └── layout.tsx
├── components/
│   ├── common/
│   ├── modals/
│   └── ... (기능별 컴포넌트)
├── hooks/
├── services/ (API 호출 함수)
├── stores/ (Redux Toolkit)
├── types/
└── utils/
```

<br>

## 🧑‍💻 팀원 및 역할 분담

|     이름     |    포지션    | 담당 주요 기능                                    |               GitHub                |
|:----------:|:---------:|:--------------------------------------------|:-----------------------------------:|
| **Jayden** | Front-end | 검색, 카카오맵, 스케줄(생성/수정/상세), 각종 모달, 알림, 네비게이션 바 | [GitHub](https://github.com/Jayden) |
| **Julia**  | Front-end | 모임(생성/수정), 메인 피드(정렬/필터/좋아요), 내 공간           | [GitHub](https://github.com/Julia)  |
|  **Eve**   | Front-end | 인증(로그인/회원가입), 계정 관리, 댓글, 신청서, 헤더            |  [GitHub](https://github.com/Eve)   |
| **Ronnie** | Back-end  | Django Ninja REST API 서버 전체 구축 및 API 문서화    | [GitHub](https://github.com/Ronnie) |

<br>

### 개선 목표

- **API 모듈화**: 중복되는 API 호출 로직을 통합하여 재사용성 및 유지보수 효율을 높일 계획입니다.
- **성능 최적화**: Lighthouse 점수 개선을 위해 `Next/Image`를 활용한 이미지 최적화 및 `dynamic import`를 통한 무거운 라이브러리 지연 로딩을 적용할 예정입니다.
- **UI/UX 개선**: 사용자 피드백을 반영하여 모바일 반응형 레이아웃을 다듬고, '상단으로 가기' 버튼, 다크 모드 등 편의 기능을 추가하고자 합니다.

