-- =============================================================================
-- Spring Board 프로젝트 Oracle DB Schema
-- =============================================================================

-- 1. 기존 객체 삭제 (개발 초기화용)
-- =============================================================================
BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE COMMENTS';
EXCEPTION
   WHEN OTHERS THEN IF SQLCODE != -942 THEN RAISE; END IF;
END;
/
BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE BOARD';
EXCEPTION
   WHEN OTHERS THEN IF SQLCODE != -942 THEN RAISE; END IF;
END;
/
BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE USERS';
EXCEPTION
   WHEN OTHERS THEN IF SQLCODE != -942 THEN RAISE; END IF;
END;
/

-- 2. 테이블 생성
-- =============================================================================

-- USERS 테이블: 사용자 정보 저장
CREATE TABLE USERS
(
    IDX          NUMBER GENERATED AS IDENTITY PRIMARY KEY,
    USER_TYPE    VARCHAR2(50)   DEFAULT 'general' NOT NULL,
    ID           VARCHAR2(100)  UNIQUE NOT NULL,
    PWD          VARCHAR2(255)  NOT NULL,
    NAME         VARCHAR2(1000) NOT NULL,
    PHONE        VARCHAR2(1000) UNIQUE,
    ADDRESS      VARCHAR2(2000),
    CREATED      TIMESTAMP(6)   DEFAULT CURRENT_TIMESTAMP NOT NULL,
    LAST_UPDATED TIMESTAMP(6)   DEFAULT CURRENT_TIMESTAMP NOT NULL
);

COMMENT ON TABLE USERS IS '사용자 정보 테이블';
COMMENT ON COLUMN USERS.USER_TYPE IS '사용자 타입 (ADMIN, GUEST)';
COMMENT ON COLUMN USERS.PHONE IS 'AES-256 암호화된 연락처';

-- BOARD 테이블: 게시물 정보 저장
CREATE TABLE BOARD
(
    IDX                NUMBER GENERATED AS IDENTITY PRIMARY KEY,
    TITLE              VARCHAR2(255)  NOT NULL,
    DESCRIPTION        CLOB,
    WRITER             VARCHAR2(100)  NOT NULL,
    CREATED            TIMESTAMP(6)   DEFAULT CURRENT_TIMESTAMP NOT NULL,
    LAST_UPDATED       TIMESTAMP(6)   DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FILE_URL           VARCHAR2(1000),
    ORIGINAL_FILE_NAME VARCHAR2(500),
    IP_ADDRESS         VARCHAR2(50)
);

COMMENT ON TABLE BOARD IS '게시판 테이블';
COMMENT ON COLUMN BOARD.DESCRIPTION IS '게시물 내용 (HTML 포함)';

-- COMMENTS 테이블: 댓글 정보 저장
CREATE TABLE COMMENTS
(
    IDX          NUMBER GENERATED AS IDENTITY PRIMARY KEY,
    BOARD_IDX    NUMBER NOT NULL,
    CONTENT      VARCHAR2(2000) NOT NULL,
    WRITER       VARCHAR2(100)  NOT NULL,
    CREATED_DATE TIMESTAMP(6)   DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT FK_BOARD_IDX FOREIGN KEY (BOARD_IDX) REFERENCES BOARD (IDX) ON DELETE CASCADE
);

COMMENT ON TABLE COMMENTS IS '댓글 테이블';
COMMENT ON COLUMN COMMENTS.BOARD_IDX IS '원본 게시물 ID (FK)';


-- 3. 함수 생성
-- =============================================================================

-- 한글 초성 검색 함수
CREATE FUNCTION F_GET_CHOSUNG(p_string IN VARCHAR2)
    RETURN VARCHAR2
    DETERMINISTIC
    IS
    v_result VARCHAR2(4000);
    v_char VARCHAR2(4);
    n_char_code NUMBER;

    -- 초성 배열
    TYPE chosung_arr IS VARRAY(19) OF VARCHAR2(3);
    v_chosungs chosung_arr := chosung_arr('ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ');

BEGIN
    FOR i IN 1..LENGTH(p_string)
        LOOP
            v_char := SUBSTR(p_string, i, 1);
            n_char_code := TO_NUMBER(SUBSTR(ASCIISTR(v_char), 2, 4), 'XXXX');

            -- 한글 음절 범위 (가-힣)
            IF n_char_code >= 44032 AND n_char_code <= 55203 THEN
                -- 초성 인덱스 계산
                v_result := v_result || v_chosungs(FLOOR((n_char_code - 44032) / 588) + 1);
                -- 영문자
            ELSIF (n_char_code >= 65 AND n_char_code <= 90) OR (n_char_code >= 97 AND n_char_code <= 122) THEN
                v_result := v_result || UPPER(v_char);
                -- 기타 문자
            ELSE
                v_result := v_result || v_char;
            END IF;
        END LOOP;

    RETURN v_result;
END;
/

-- HTML 태그 처리 함수
CREATE FUNCTION F_STRIP_TAGS(p_string IN CLOB)
    RETURN VARCHAR2
    DETERMINISTIC
    IS
BEGIN
    -- 정규 표현식을 사용하여 <> 사이에 있는 모든 HTML 태그를 제거
    RETURN REGEXP_REPLACE(p_string, '<[^>]+>', '');
END;
/

-- 4. 인덱스 생성 (성능 최적화)
-- =============================================================================
CREATE INDEX IDX_COMMENTS_BOARD_IDX ON COMMENTS (BOARD_IDX);
CREATE INDEX IDX_BOARD_TITLE_CHOSUNG ON BOARD (F_GET_CHOSUNG(TITLE));
CREATE INDEX IDX_BOARD_WRITER_CHOSUNG ON BOARD (F_GET_CHOSUNG(WRITER));
CREATE INDEX IDX_BOARD_DESC_STRIPPED ON BOARD (F_STRIP_TAGS(DESCRIPTION));

-- 5. 기본 데이터 삽입 (관리자 계정)
-- =============================================================================
-- 중요: PWD 값은 'admin123'을 BCrypt로 인코딩한 예시.
-- 실제 운영 시에는 애플리케이션 회원가입 기능으로 관리자 계정을 생성할 것!
INSERT INTO USERS (ID, PWD, NAME, USER_TYPE, PHONE, ADDRESS)
VALUES (
    'admin',
    '$2a$10$vG5K.gA75G.50p5s3aR7lu2rA3g3a29.8u.o/2Q.9z/wz.KzG3z9O', -- 'admin123'
    '관리자',
    'ADMIN',
    'encrypt:010-1234-5678',
    '서울시 강남구'
);

INSERT INTO USERS (ID, PWD, NAME, USER_TYPE, PHONE, ADDRESS)
VALUES (
    'user',
    '$2a$10$vG5K.gA75G.50p5s3aR7lu2rA3g3a29.8u.o/2Q.9z/wz.KzG3z9O', -- 'admin123'
    '홍길동',
    'GUEST',
    'encrypt:010-1111-2222',
    '경기도 성남시'
);

COMMIT;