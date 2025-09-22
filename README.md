# Spring & React 보안 강화 게시판 (Spring Board)

- Spring Boot와 React를 기반으로 한 풀스택 게시판 프로젝트.
- 기본적인 CRUD 기능을 넘어, 실제 서비스 환경에서 고려해야 할 주요 보안 요소(XSS, CSRF, 개인정보 암호화 등)와 고급 검색 기능(한글 초성 검색)을 구현하는 것을 목표로 구현.

---

## 📑 목차

- 프로젝트 개요
- 주요 기능
- 요구사항 확인서
- API 정의서
- 기술 스택
- 트러블 슈팅

---

## 1. 프로젝트 개요

### 1.1 프로젝트 소개

본 프로젝트는 Spring Boot를 이용한 백엔드 API 서버와 React(Vite) 기반의 프론트엔드 UI를 분리하여 개발한 현대적인 풀스택 웹 애플리케이션
사용자 인증, 게시물 관리 등 게시판의 핵심 기능을 포함하며, 실제 운영 환경을 고려한 다양한 보안 기능을 적용함.

### 1.2 개발 목표

- **기본 기능**: 사용자 및 게시물에 대한 CRUD 기능 완전 구현
- **보안 강화**: Spring Security를 도입하여 XSS, CSRF, SQL 인젝션 등 주요 웹 취약점을 방어하고 개인정보 암호화 적용
- **사용자 경험**: React 기반 SPA, 페이징 및 한글 초성 검색 기능 지원
- **최신 기술 스택**: 현대적인 웹 개발 트렌드 학습 및 적용

---

## 2. 주요 기능

### 👤 사용자 기능

- 회원가입: ID, 비밀번호, 이름, 연락처, 주소 입력
- 로그인/로그아웃: Spring Security 기반 인증
- 개인정보 수정 (비밀번호, 이름 등)
- 회원 탈퇴

### 📋 게시판 기능

- 게시글 작성(Create): TipTap 위지윅 에디터 사용
- 게시글 목록 조회(Read): 페이징 처리된 게시글 목록
- 게시글 상세 조회(Read)
- 게시글 수정(Update): 본인 작성글만 가능
- 게시글 삭제(Delete): 본인 작성글만 가능
- 검색: 제목/내용/작성자 검색 + 한글 초성 검색
- 파일 첨부: 이미지 업로드 및 별도 파일 다운로드 (파일명 유지, 한글 깨짐 방지)

### 👑 관리자 기능

- 회원 관리: 전체 회원 조회, 특정 회원 강제 삭제
- 게시물 관리: 모든 게시물 수정 및 삭제 가능
- IP 주소 확인: 게시물 작성자의 IP 확인

---

## 3. 요구사항 확인서

| No. | 기능                  | 구현 여부 | 비고                        |
| --- | --------------------- | --------- | --------------------------- |
| 1   | 사용자 관리 (CRUD)    | ✅        | Spring Security 인증/인가   |
| 2   | 게시물 관리 (CRUD)    | ✅        | TipTap, 파일 첨부 포함      |
| 3   | 보안 강화 (XSS, CSRF) | ✅        | OWASP Sanitizer, CSRF 토큰  |
| 4   | 개인정보 암호화       | ✅        | AES-256                     |
| 5   | 비밀번호 암호화       | ✅        | BCrypt                      |
| 6   | 비밀번호 정책 강화    | ✅        | 최소 8자, 대소문자/특수문자 |
| 7   | 게시물 검색           | ✅        | 일반 검색 + 초성 검색       |
| 8   | 게시물 페이징         | ✅        | Spring Data Pageable        |
| 9   | 관리자 기능           | ✅        | 회원/게시물 관리, IP 확인   |

---

## 4. API 정의서

**Base URL**: `http://localhost:8080`

### 👤 User API

| Method | URL                 | 설명             | 권한        |
| ------ | ------------------- | ---------------- | ----------- |
| POST   | /api/users/register | 회원가입         | 누구나      |
| POST   | /api/users/login    | 로그인           | 누구나      |
| POST   | /api/users/logout   | 로그아웃         | 인증 사용자 |
| GET    | /api/users/me       | 현재 사용자 조회 | 누구나      |
| PUT    | /api/users/update   | 본인 정보 수정   | 인증 사용자 |
| DELETE | /api/users/delete   | 회원 탈퇴        | 인증 사용자 |

### 📋 Board API

| Method | URL               | 설명                           | 권한          |
| ------ | ----------------- | ------------------------------ | ------------- |
| POST   | /api/boards/write | 게시글 작성                    | 인증 사용자   |
| GET    | /api/boards       | 게시글 목록 조회 (페이징/검색) | 누구나        |
| GET    | /api/boards/{id}  | 게시글 상세 조회               | 누구나        |
| PUT    | /api/boards/{id}  | 게시글 수정                    | 작성자/관리자 |
| DELETE | /api/boards/{id}  | 게시글 삭제                    | 작성자/관리자 |

### 📂 File API

| Method | URL                            | 설명          | 권한        |
| ------ | ------------------------------ | ------------- | ----------- |
| POST   | /api/files/upload              | 파일 업로드   | 인증 사용자 |
| GET    | /api/files/download/{fileName} | 파일 다운로드 | 누구나      |

### 👑 Admin API

| Method | URL                     | 설명           | 권한   |
| ------ | ----------------------- | -------------- | ------ |
| GET    | /api/admin/users        | 회원 목록 조회 | 관리자 |
| GET    | /api/admin/users/{id}   | 특정 회원 조회 | 관리자 |
| PUT    | /api/admin/users/update | 회원 정보 수정 | 관리자 |
| DELETE | /api/admin/users/{id}   | 특정 회원 삭제 | 관리자 |

---

## 5. 기술 스택

### 🖥️ Frontend

![HTML5](https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white) 
![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white) 
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black) 
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) 
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

### ⚙️ Backend

![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![Java](https://img.shields.io/badge/Java-007396?style=for-the-badge&logo=openjdk&logoColor=white) 
![Spring Security](https://img.shields.io/badge/Spring_Security-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

### 💾 Database

![Oracle](https://img.shields.io/badge/Oracle-4479A1?style=for-the-badge&logo=oracle&logoColor=white)

### ☁️ Deployment & Tools

![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white) 
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)

---

## 6. 트러블 슈팅

<details>
<summary><strong>1. 한글 초성 검색 구현 문제</strong></summary>

- **문제**: 'ㅋㅇㅍ' 검색 시 '케이팝' 결과 미출력
- **원인**: Oracle LIKE 연산자 언어 설정 미지원, DECOMPOSE 함수 불안정
- **해결**:
  - 유니코드 코드포인트 직접 계산 PL/SQL 함수(F_GET_CHOSUNG) 구현
  - `REGEXP_LIKE` 활용하여 Mapper 쿼리 수정
  - 함수 기반 인덱스(Function-Based Index) 적용
  </details>

<details>
<summary><strong>2. 파일 업로드 경로 조작 취약점</strong></summary>

- **문제**: `../../` 삽입 시 다른 디렉토리 접근 가능
- **원인**: 파일명 검증 미흡
- **해결**:
  - `FilenameUtils.getName()` 사용하여 순수 파일명 추출
  - Canonical Path 검증 로직 추가하여 상위 경로 차단
  </details>

<details>
<summary><strong>3. Spring Security 도입 후 CORS/CSRF 오류</strong></summary>

- **문제**: 로그인/회원가입 요청 시 `401/403` 오류
- **원인**:
  - 기본 `formLogin`이 302 리다이렉트 → API 통신과 충돌
  - CSRF 활성화 시 토큰 없는 요청 차단
- **해결**:
  - `successHandler`, `failureHandler` 커스텀하여 상태코드 반환
  - 로그인/회원가입 경로를 `csrf().ignoringRequestMatchers(...)`에 등록
  </details>
