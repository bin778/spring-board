# 🌱 Spring & React 온라인 게시판 (Spring Board)

Spring Boot와 React를 기반으로 한 풀스택 게시판 프로젝트. 기본적인 CRUD 기능을 넘어, 실제 서비스 환경에서 고려해야 할 주요 보안 요소(XSS, CSRF, 개인정보 암호화 등)와 고급 검색 기능(한글 초성 검색)을 구현하는 것을 목표로 개발.

---

## 📑 목차

- 프로젝트 개요
- 주요 기능
- 요구사항 확인서
- API 정의서
- 기술 스택
- 트러블 슈팅

---

## 1. 📘 프로젝트 개요

### 1.1 프로젝트 소개

- **백엔드**: Spring Boot 기반 API 서버
- **프론트엔드**: React (Vite) 기반 SPA UI
- **주요 특징**: 사용자 인증, 게시물 관리, 첨부파일, 보안 강화(XSS/CSRF/암호화)
- **DB**: Apple Silicon macOS 환경에서 Docker를 이용하여 Oracle 컨테이너를 생성하고 실행.
  - `colima start --memory 4 --arch x86_64`: Oracle은 x86/64 아키텍처 계열만 지원하기 때문에 x86_64 환경을 에뮬레이션하여 Docker 실행 환경을 구축.

### 1.2 개발 목표

- **기본 기능**: 사용자 및 게시물 CRUD 완전 구현
- **보안 강화**: Spring Security, XSS/CSRF 방어, 개인정보 AES-256 암호화
- **사용자 경험**: SPA 환경, 페이징, 한글 초성 검색
- **최신 기술 학습**: 현대적인 풀스택 웹 개발 트렌드 반영

---

## 2. 🚀 주요 기능

### 👤 사용자 기능

- 회원가입: ID, 비밀번호, 이름, 연락처, 주소 입력
- 로그인/로그아웃 (세션 기반 인증)
- 개인정보 수정 및 회원 탈퇴

### 📋 게시판 기능

- 게시글 작성 (TipTap 위지윅 에디터)
- 게시글 목록/상세 조회 (페이징 지원)
- 게시글 수정/삭제 (작성자 본인만 가능)
- 검색: 제목, 내용, 작성자 + **한글 초성 검색 지원**
- 파일 첨부: 이미지 업로드/표시, 파일 다운로드(파일명 유지, 한글 깨짐 방지)

### 👑 관리자 기능

- 회원 관리 (조회/삭제)
- 게시물 관리 (수정/삭제)
- 게시글 작성자 **IP 주소 확인**

---

## 3. ✅ 요구사항 확인서

| No. | 기능                  | 구현 여부 | 비고                             |
| --- | --------------------- | --------- | -------------------------------- |
| 1   | 사용자 관리 (CRUD)    | ✅        | Spring Security 인증/인가        |
| 2   | 게시물 관리 (CRUD)    | ✅        | TipTap, 파일 첨부 포함           |
| 3   | 보안 강화 (XSS, CSRF) | ✅        | OWASP Sanitizer, CSRF 토큰       |
| 4   | 개인정보 암호화       | ✅        | AES-256(해시)                    |
| 5   | 비밀번호 암호화       | ✅        | BCrypt(솔트)                     |
| 6   | 비밀번호 정책 강화    | ✅        | 최소 8자, 대소문자/특수문자 포함 |
| 7   | 게시물 검색           | ✅        | 일반 검색 + 초성 검색            |
| 8   | 게시물 페이징         | ✅        | Spring Data Pageable             |
| 9   | 관리자 기능           | ✅        | 회원/게시물 관리, IP 확인        |

---

## 4. 📡 API 정의서

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

| Method | URL               | 설명             | 권한          |
| ------ | ----------------- | ---------------- | ------------- |
| POST   | /api/boards/write | 게시글 작성      | 인증 사용자   |
| GET    | /api/boards       | 게시글 목록 조회 | 누구나        |
| GET    | /api/boards/{id}  | 게시글 상세 조회 | 누구나        |
| PUT    | /api/boards/{id}  | 게시글 수정      | 작성자/관리자 |
| DELETE | /api/boards/{id}  | 게시글 삭제      | 작성자/관리자 |

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

![Oracle](https://img.shields.io/badge/Oracle-F80000?style=for-the-badge&logo=oracle&logoColor=white)

### ☁️ Deployment & Tools

![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

---

## 6. 🐞 트러블 슈팅

<details>
<summary><strong>1. 한글 초성 검색 구현 문제</strong></summary>

- 문제: `'ㅋㅇㅍ'` 검색 시 `'케이팝'` 미출력 또는 Oracle 환경 오작동
- 원인: Oracle LIKE 연산자의 언어 설정 미지원, DB 문자셋 문제
- 해결:
  - `ASCIISTR` + `TO_NUMBER` 조합으로 **유니코드 코드 포인트 직접 계산**
  - PL/SQL 함수 `F_GET_CHOSUNG` 구현
  - `REGEXP_LIKE` 및 함수 기반 인덱스 생성으로 성능 문제 해결
  </details>

<details>
<summary><strong>2. MyBatis null 파라미터 타입 오류 (ORA-17004)</strong></summary>

- 문제: 첨부파일이나 개인정보가 null일 때 `ORA-17004` 발생
- 원인: MyBatis가 null 파라미터의 JDBC 타입을 추론 불가
- 해결:
  - Mapper XML에 `jdbcType=VARCHAR` 지정 → 일부 해결
  - 최종: `application.properties`에  
   `properties
  mybatis.configuration.jdbc-type-for-null=NULL
  `
  설정하여 전역적으로 null 타입 지정
  </details>

<details>
<summary><strong>3. Spring Security 도입 후 CORS/CSRF 오류</strong></summary>

- 문제: 로그인/회원가입 시 `401 Unauthorized` 또는 `403 Forbidden`
- 원인:
  - `formLogin`의 기본 302 리다이렉트 → CORS 오류
  - CSRF 토큰 검증이 로그인/회원가입까지 차단
- 해결:
  - `successHandler`, `failureHandler` 커스텀 → 200/401 반환
  - `csrf().ignoringRequestMatchers(...)`로 로그인/회원가입 경로 예외 처리
  </details>
