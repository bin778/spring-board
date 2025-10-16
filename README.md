# 🌱 Spring & React 온라인 게시판 (Spring Board)

Spring Boot와 React를 기반으로 한 풀스택 게시판 프로젝트. 기본적인 CRUD 기능을 넘어, 실제 서비스 환경에서 고려해야 할 주요 보안 요소(XSS, CSRF, 개인정보 암호화 등)와 고급 검색 기능(한글 초성 검색)을 구현하는 것을 목표로 개발.

---

## 📑 목차

- [1. 프로젝트 개요](#1--프로젝트-개요)
- [2. 주요 기능](#2--주요-기능)
- [3. 요구사항 확인서](#3--요구사항-확인서)
- [4. API 정의서](#4--api-정의서)
- [5. 기술 스택](#5-%EF%B8%8F-기술-스택)
- [6. 빌드 및 실행](#6--빌드-및-실행)
- [7. 트러블 슈팅](#7--트러블-슈팅)
- [8. 실행 화면](#8--실행-화면)

---

## 1. 📘 프로젝트 개요

### 1.1 프로젝트 소개

본 프로젝트는 Spring Boot를 이용한 백엔드 API 서버와 React(Vite) 기반의 프론트엔드 UI를 분리하여 개발한 현대적인 풀스택 웹 애플리케이션. 사용자 인증, 게시물 관리, 댓글, 파일 첨부 등 게시판의 핵심 기능을 포함하며, 실제 운영 환경을 고려한 다양한 보안 기능을 적용.

### 1.2 개발 목표

- **기본 기능**: 사용자, 게시물, 댓글에 대한 CRUD 기능 완전 구현
- **보안 강화**: Spring Security를 도입하여 XSS, CSRF, SQL 인젝션 등 주요 웹 취약점을 방어하고, 개인정보를 AES-256으로 양방향 암호화하여 안전하게 관리
- **사용자 경험**: React 기반의 SPA(Single Page Application)를 구축하고, 페이징 및 한글 초성 검색 등 고급 검색 기능을 통해 사용자 편의성 증대
- **배포**: Docker를 이용한 컨테이너화 및 배포 프로세스 학습

---

## 2. 🚀 주요 기능

### 👤 사용자 기능

- **회원가입**: ID, 비밀번호, 이름, 연락처, 주소 입력
  - 비밀번호 복잡도(최소 8자, 대소문자/특수문자 포함) 실시간 검증
  - 전화번호 형식 유효성 검증
- **로그인/로그아웃**: Spring Security 기반 세션 인증
- **개인정보 수정**: 본인의 개인정보(비밀번호, 이름 등) 수정
- **회원 탈퇴**

### 📋 게시판 기능

- **게시글 CRUD**: TipTap 위지윅 에디터를 사용한 게시글 생성, 조회, 수정, 삭제
- **댓글 CRUD**: 게시글 하위의 댓글 생성, 조회, 수정, 삭제
- **검색**: 제목, 내용, 작성자를 기준으로 일반 검색 및 **한글 초성 검색** 지원
- **페이징**: 게시글 목록에 대한 페이지네이션 기능
- **파일 첨부**:
  - 게시글 내용에 이미지 업로드 및 표시 (XSS 방어 처리)
  - 별도의 파일 첨부 및 다운로드 (파일명 유지, 한글 깨짐 방지)
  - 파일 크기 제한(20MB) 및 예외 처리

### 👑 관리자 기능

- **회원 관리**: 전체 회원 목록 조회 및 특정 회원 강제 삭제
- **게시물 관리**: 모든 사용자의 게시물을 수정 및 삭제
- **IP 주소 확인**: 각 게시물 작성자의 IP 주소 확인
- **데이터 백업**: 전체 게시물 목록을 **Excel 파일로 다운로드**

---

## 3. ✅ 요구사항 확인서

| No. | 기능                   | 구현 여부 | 비고                              |
| :-: | ---------------------- | :-------: | --------------------------------- |
|  1  | 사용자 관리 (CRUD)     |    ✅     | Spring Security 인증/인가         |
|  2  | 게시물 관리 (CRUD)     |    ✅     | TipTap 에디터, 파일 첨부, IP 추적 |
|  3  | 댓글 관리 (CRUD)       |    ✅     | 게시글 종속 기능                  |
|  4  | 보안 강화 (XSS, CSRF)  |    ✅     | OWASP Sanitizer, CSRF 토큰        |
|  5  | 개인정보 암호화        |    ✅     | AES-256 양방향 암호화             |
|  6  | 비밀번호 암호화        |    ✅     | BCrypt (Salt 자동 포함)           |
|  7  | 비밀번호/전화번호 정책 |    ✅     | 정규 표현식을 이용한 실시간 검증  |
|  8  | 게시물 검색            |    ✅     | 일반 검색 + 초성 검색             |
|  9  | 게시물 페이징          |    ✅     | Spring Data Pageable              |
| 10  | 관리자 기능            |    ✅     | 회원/게시물 관리, Excel 다운로드  |
| 11  | Docker 컨테이너화      |    ✅     | Backend, Frontend 애플리케이션 컨테이너화 완료     |
| 12  | Kubernetes 실습        |    ✅     | 로컬(Docker Desktop) 환경에서 전체 애플리케이션 배포 |

---

## 4. 📡 API 정의서

**Base URL**: `http://localhost:8080`

### 👤 User API

|  Method  | URL                   | 설명             |    권한     |
| :------: | --------------------- | ---------------- | :---------: |
|  `POST`  | `/api/users/register` | 회원가입         |   누구나    |
|  `POST`  | `/api/users/login`    | 로그인           |   누구나    |
|  `POST`  | `/api/users/logout`   | 로그아웃         | 인증 사용자 |
|  `GET`   | `/api/users/me`       | 현재 사용자 조회 |   누구나    |
|  `PUT`   | `/api/users/update`   | 본인 정보 수정   | 인증 사용자 |
| `DELETE` | `/api/users/delete`   | 회원 탈퇴        | 인증 사용자 |

### 📋 Board API

|  Method  | URL                 | 설명             |     권한      |
| :------: | ------------------- | ---------------- | :-----------: |
|  `POST`  | `/api/boards/write` | 게시글 작성      |  인증 사용자  |
|  `GET`   | `/api/boards`       | 게시글 목록 조회 |    누구나     |
|  `GET`   | `/api/boards/{id}`  | 게시글 상세 조회 |    누구나     |
|  `PUT`   | `/api/boards/{id}`  | 게시글 수정      | 작성자/관리자 |
| `DELETE` | `/api/boards/{id}`  | 게시글 삭제      | 작성자/관리자 |

### 💬 Comment API

|  Method  | URL                              | 설명                         |     권한      |
| :------: | -------------------------------- | ---------------------------- | :-----------: |
|  `GET`   | `/api/boards/{boardId}/comments` | 특정 게시글의 댓글 목록 조회 |    누구나     |
|  `POST`  | `/api/boards/{boardId}/comments` | 댓글 작성                    |  인증 사용자  |
|  `PUT`   | `/api/comments/{commentId}`      | 댓글 수정                    | 작성자/관리자 |
| `DELETE` | `/api/comments/{commentId}`      | 댓글 삭제                    | 작성자/관리자 |

### 📂 File API

| Method | URL                              | 설명          |    권한     |
| :----: | -------------------------------- | ------------- | :---------: |
| `POST` | `/api/files/upload`              | 파일 업로드   | 인증 사용자 |
| `GET`  | `/api/files/download/{fileName}` | 파일 다운로드 |   누구나    |

### 👑 Admin API

|  Method  | URL                       | 설명                  |  권한  |
| :------: | ------------------------- | --------------------- | :----: |
|  `GET`   | `/api/admin/users`        | 회원 목록 조회        | 관리자 |
|  `GET`   | `/api/admin/users/{id}`   | 특정 회원 조회        | 관리자 |
|  `PUT`   | `/api/admin/users/update` | 회원 정보 수정        | 관리자 |
| `DELETE` | `/api/admin/users/{id}`   | 특정 회원 삭제        | 관리자 |
|  `GET`   | `/api/admin/boards/excel` | 게시글 Excel 다운로드 | 관리자 |

---

## 5. 🛠️ 기술 스택

### 🖥️ Frontend

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

### ⚙️ Backend

![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![Java](https://img.shields.io/badge/Java-007396?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring_Security-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![MyBatis](https://img.shields.io/badge/MyBatis-000000?style=for-the-badge&logo=mybatis&logoColor=white)

### 💾 Database

![Oracle](https://img.shields.io/badge/Oracle-F80000?style=for-the-badge&logo=oracle&logoColor=white)

### 🐳 DevOps & Tools

![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/kubernetes-%23326ce5.svg?style=for-the-badge&logo=kubernetes&logoColor=white)

---

## 6. 🚀 빌드 및 실행

### Backend (Docker)

1.  **Docker 이미지 다운로드**: `Docker Hub`에 있는 `bin778/spring-board:latest` 이미지를 사용하여 애플리케이션을 실행
    ```bash
    docker pull bin778/spring-board:latest
    ```
2.  **Docker 컨테이너 실행**: 명령어의 `-e` 플래그로 설정하는 환경 변수 값들을 반드시 자신의 환경에 맞게 수정.
    ```bash
    docker run -d -p 8080:8080 \
      -e "SPRING_PROFILES_ACTIVE=docker" \
      -e "DB_URL=jdbc:oracle:thin:@host.docker.internal:1521:XE" \
      -e "DB_USERNAME=your_db_username" \
      -e "DB_PASSWORD=your_db_password" \
      -e "ENCRYPTION_KEY=your_secret_encryption_key" \
      --name spring-board-app \
      bin778/spring-board:latest
    ```

| 환경 변수 이름           | 설명                                                                                          | 기본값 / 예시                                  |
|----------------------------|-----------------------------------------------------------------------------------------------|------------------------------------------------|
| SPRING_PROFILES_ACTIVE     | 실행 환경 프로파일을 설정. 특별한 경우가 아니면 `docker`로 유지할 것.                | `docker`                                         |
| DB_URL                     | 연결할 Oracle 데이터베이스의 URL. `host.docker.internal`은 Docker 컨테이너가 실행 중인 호스트 머신을 가리킴. | `jdbc:oracle:thin:@host.docker.internal:1521:XE` |
| DB_USERNAME                | 데이터베이스 사용자 아이디를 입력.                                                 | `db_username`                                         |
| DB_PASSWORD                | 데이터베이스 비밀번호를 입력.                                                      | `db_password`                                         |
| ENCRYPTION_KEY             | 애플리케이션 내부에서 사용할 대칭 암호화 키.                                        | `your_secret_encryption_key`                          |


### Frontend

1.  **의존성 설치**: `frontend` 디렉토리에서 아래 명령어 실행
    ```bash
    npm install
    ```
2.  **개발 서버 실행**:
    ```bash
    npm run dev
    ```
3.  **프로덕션 빌드**:
    ```bash
    npm run build
    ```
    
### Frontend (Docker)

1.  **Frontend Docker 이미지 빌드**: `Docker Hub`에 있는 `bin778/spring-board-frontend:latest` 이미지를 사용하여 애플리케이션을 실행
    ```bash
    docker pull bin778/spring-board-frontend:latest .
    ```
2.  **Frontend Docker 컨테이너 실행**: Nginx 기반의 웹 서버로 Frontend를 서빙
    ```bash
    docker run -d -p 3000:80 --name spring-board-frontend bin778/spring-board-frontend:latest
    ```

### Kubernetes 실습 (로컬 환경)

전체 애플리케이션 스택(DB, Backend, Frontend)을 로컬 쿠버네티스 클러스터에 배포.

1.  **사전 준비**:
    - Docker Desktop을 설치하고 `Settings > Kubernetes > Enable Kubernetes`를 활성화.
    - 프로젝트 최상단에 모든 쿠버네티스 리소스를 정의한 `k8s-deployment.yml` 파일을 준비.

2.  **로컬 이미지 빌드**:
    - 위에서 설명한 `Backend`와 `Frontend` Docker 이미지를 미리 빌드해 둬야 함.

3.  **쿠버네티스 배포**:
    - 프로젝트 최상단에서 아래 명령어를 실행하여 모든 리소스를 클러스터에 배포.
    ```bash
    kubectl apply -f k8s-deployment.yml
    ```

4.  **상태 확인**:
    - Pod와 Service가 정상적으로 실행되는지 확인.
    ```bash
    kubectl get pods -w
    kubectl get services
    ```

5.  **애플리케이션 접속**:
    - 배포가 완료되면 브라우저에서 아래 주소로 접속.
    - **`http://localhost:30000`**

6.  **리소스 정리**:
    - 실습이 끝난 후 아래 명령어로 배포했던 모든 리소스를 삭제.
    ```bash
    kubectl delete -f k8s-deployment.yml
    ```
    
---

## 7. 🐞 트러블 슈팅

<details>
<summary><strong>1. 한글 초성 검색 구현 문제</strong></summary>

- **문제**: `'ㅋㅇㅍ'` 검색 시 `'케이팝'` 결과 미출력 또는 Oracle DB 환경에서 오작동
- **원인**: Oracle `LIKE` 연산자의 언어 설정 미지원, DB 문자셋 차이로 인한 유니코드 계산 오류.
- **해결**:
  - `ASCIISTR` + `TO_NUMBER` 조합으로 **유니코드 코드 포인트를 직접 계산**하는 PL/SQL 함수(`F_GET_CHOSUNG`)를 구현.
  - `REGEXP_LIKE`를 사용하여 언어 규칙에 맞게 검색하고, 함수 기반 인덱스를 생성하여 성능 문제를 해결.

</details>

<details>
<summary><strong>2. MyBatis `null` 파라미터 타입 오류 (ORA-17004)</strong></summary>

- **문제**: 첨부파일이나 개인정보(연락처 등)가 없는 `null` 상태로 데이터 수정 시 `ORA-17004` 발생.
- **원인**: MyBatis가 `null` 파라미터의 JDBC 타입을 추론하지 못함.
- **해결**:
  - `application.properties`에 `mybatis.configuration.jdbc-type-for-null=NULL` 설정을 추가하여, 모든 `null` 파라미터에 대해 JDBC 타입을 `NULL`로 명시하도록 전역 설정.

</details>

<details>
<summary><strong>3. Spring Security 도입 후 CORS/CSRF 오류</strong></summary>

- **문제**: 로그인/회원가입 등 `POST` 요청 시 `401 Unauthorized` 또는 `403 Forbidden` 오류 발생.
- **원인**: `formLogin`의 기본 302 리다이렉트 동작이 SPA와 충돌, CSRF 토큰 검증이 토큰 없는 초기 요청까지 차단.
- **해결**:
  - `successHandler`, `failureHandler`를 커스텀하여 리다이렉트 대신 `200/401` 상태 코드를 반환하도록 수정.
  - `csrf().ignoringRequestMatchers(...)`를 통해 로그인/회원가입 경로를 CSRF 검증 예외로 명시적으로 등록.

</details>

<details>
<summary><strong>4. Docker 컨테이너 실행 오류 해결 과정</strong></summary>

- **1차 문제: DB 연동 실패**
  - **문제**: `ORA-12541: Cannot connect. No listener at host localhost port 1521.`
  - **원인**: 컨테이너 내부의 `localhost`는 컨테이너 자신을 가리키므로, 호스트 PC의 DB에 접속할 수 없음.
  - **해결**: 접속 주소를 `localhost`에서 `host.docker.internal`로 변경하여 컨테이너가 호스트 PC를 바라보도록 수정.
- **2차 문제: 설정 파일 누락**
  - **문제**: `Failed to configure a DataSource: 'url' attribute is not specified`
  - **원인**: `application-docker.yml` 파일을 프로젝트에 추가했지만, `mvn clean package`를 다시 실행하지 않아 새로 빌드된 `.jar` 파일에 해당 설정이 포함되지 않았음.
  - **해결**: Docker 이미지를 빌드하기 전에 반드시 Maven 프로젝트를 먼저 빌드하여 최신 변경사항이 .jar 파일에 반영되도록 프로세스를 수정
- **3차 문제: 민감한 정보(암호화 키) 누락**
  - **문제**: `Could not resolve placeholder 'encryption.key'`
  - **원인**: 암호화 키가 Docker 프로파일 설정 파일에 정의되지 않았음. 또한, 보안을 위해 민감한 정보를 `Git`에 포함시키지 않았음.
  - **해결**: 모든 민감 정보(DB 접속 정보, 암호화 키)를 환경 변수로 외부에서 주입하도록 `application.yml`과 `docker run` 명령어를 수정. 이를 통해 동일한 이미지를 어떤 환경에서든 설정만 바꿔서 실행할 수 있는 유연하고 안전한 구조를 완성.

</details>

<details>
<summary><strong>5. Kubernetes 로컬 실습 오류 해결 과정</strong></summary>

- **목표**: 전체 애플리케이션 스택(Oracle DB, Spring Backend, React Frontend)을 로컬 쿠버네티스 클러스터에 배포하고 정상 동작 확인.
- **최종 상태**: 모든 Pod와 Service가 정상 실행되었으나, 로그인/회원가입 시 `401 Unauthorized` 오류 발생. 아키텍처에 맞지 않는 Spring Security의 `.formLogin()` 사용이 원인으로 추정되며, 추후 개선 과제로 남김.

- **1차 문제: `net::ERR_CONNECTION_REFUSED`**
  - **원인**: React 코드의 API 요청 주소가 `http://localhost:8080`으로 하드코딩되어 있었음. 쿠버네티스 환경에서는 브라우저가 백엔드 Pod로 직접 접근할 수 없으므로, 모든 요청은 프론트엔드의 `NodePort(30000)`를 통해 Nginx 프록시를 거쳐야 함.
  - **해결**: React의 `axios` 기본 URL을 `baseURL: '/'` (상대 경로)로 수정하여 모든 API 요청이 `http://localhost:30000/api/...`로 전송되도록 변경.

- **2차 문제: 코드 수정 후에도 동일한 오류 발생**
  - **원인**: React 코드를 수정하고 프론트엔드 이미지를 다시 빌드했음에도, 쿠버네티스 Pod가 기존의 오래된 이미지를 계속 사용하고 있었음. 이미지 태그가 `:latest`로 동일하여 쿠버네티스가 변경을 감지하지 못함.
  - **해결**: `kubectl rollout restart deployment <프론트엔드-배포-이름>` 명령어를 통해 Deployment를 강제로 재시작하여, Pod가 새로 빌드된 최신 이미지를 받아오도록 조치.

- **3차 문제: `403 Forbidden`**
  - **원인**: 네트워크 문제가 해결되자, 이번에는 백엔드의 Spring Security가 요청을 거부. CORS(Cross-Origin Resource Sharing) 정책에 `http://localhost:30000`이 허용된 출처(Origin)로 등록되어 있지 않았기 때문.
  - **해결**: `SecurityConfig`의 `CorsConfigurationSource`에 `http://localhost:30000`을 `allowedOrigins` 목록에 추가.

- **4차 문제: `401 Unauthorized`**
  - **원인**: CORS 문제가 해결되자, 인증이 필요 없는 `/api/users/register`와 `/api/users/login` 경로에서 `401 Unauthorized` 오류 발생. 이는 `.authorizeHttpRequests`의 `permitAll()` 규칙이 적용되기 전에, SPA/REST API 아키텍처에 맞지 않는 `.formLogin()` 필터가 먼저 동작하여 인증을 요구하기 때문으로 추정.
  - **결과**: `.formLogin()`을 제거하고 수동 로그인 API를 구현하는 방식으로 해결 방향을 잡았으나, 결국 해결은 실패하고 Pod와 Service가 정상 동작하는 단계까지를 실습의 목표까지 마무리.

</details>

---

## 8. 📸 실행 화면

#### 로그인

<img width="2000" height="1000" alt="image" src="https://github.com/user-attachments/assets/e7e7c799-17db-4306-a61d-a4074d62864e" />

#### 회원 가입

<img width="2000" height="1000" alt="image" src="https://github.com/user-attachments/assets/7960bfbb-2779-4024-9daa-11edcac1c6d7" />

#### 회원 관리

<img width="2000" height="1000" alt="image" src="https://github.com/user-attachments/assets/d3cd8af4-cd52-48a0-bfd0-039a43149580" />

#### 게시글 작성

<img width="2000" height="1000" alt="image" src="https://github.com/user-attachments/assets/9a6634dd-3c9f-4a83-b300-6708aa889c86" />

#### 게시글 목록

<img width="2000" height="1000" alt="image" src="https://github.com/user-attachments/assets/86f086f3-aa46-477b-bae4-4a52522d3c77" />

### 게시글 내용

<img width="2000" height="1000" alt="image" src="https://github.com/user-attachments/assets/9b4588e2-9e3b-42ed-871b-c32213ce89b3" />

<img width="2000" height="1000" alt="image" src="https://github.com/user-attachments/assets/dc9cb1fc-6416-43a2-8daf-40aefd56f781" />

### Kubernetes 실습 결과

<img width="848" height="230" alt="image" src="https://github.com/user-attachments/assets/9105bd25-df36-49b2-a64a-61d70150a548" />
