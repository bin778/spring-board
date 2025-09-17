package com.cyb.board.service;

import com.cyb.board.dto.BoardDto;
import com.cyb.board.mapper.BoardMapper;
import lombok.RequiredArgsConstructor;
import org.owasp.html.PolicyFactory;
import org.owasp.html.Sanitizers;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class BoardService {

    private final BoardMapper boardMapper;
    private final PolicyFactory htmlSanitizer = Sanitizers.FORMATTING.and(Sanitizers.BLOCKS).and(Sanitizers.IMAGES).and(Sanitizers.STYLES);
    private static final Pattern CHOSUNG_PATTERN = Pattern.compile("^[ㄱ-ㅎ]+$");

    public void createBoard(BoardDto boardDto) {
        String sanitizedContent = htmlSanitizer.sanitize(boardDto.getContent());
        boardDto.setContent(sanitizedContent);
        boardMapper.insertBoard(boardDto);
    }

    public Page<BoardDto> getBoards(Pageable pageable, String search) {
        int offset = (int) pageable.getOffset();
        int pageSize = pageable.getPageSize();
        List<BoardDto> boards;
        int total;

        if (search != null && CHOSUNG_PATTERN.matcher(search).matches()) {
            // 검색어가 초성으로만 이루어진 경우
            System.out.println("초성 검색 실행: " + search); // 로그 확인
            boards = boardMapper.findWithChosungSearch(offset, pageSize, search);
            total = boardMapper.countWithChosungSearch(search);
        } else {
            // 그 외의 경우 (완성형 한글, 영어, 숫자, null 등)
            System.out.println("일반 검색 실행: " + search); // 로그 확인
            boards = boardMapper.findWithPagingAndSearch(offset, pageSize, search);
            total = boardMapper.count(search);
        }
        return new PageImpl<>(boards, pageable, total);
    }

    public Optional<BoardDto> getBoardById(int id) {
        return boardMapper.findById(id);
    }

    public void updateBoard(int id, BoardDto boardDto, String currentUserId, String userRole) {
        BoardDto existingBoard = boardMapper.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        if (!existingBoard.getWriter().equals(currentUserId) && !"ADMIN".equals(userRole)) {
            throw new AccessDeniedException("수정 권한이 없습니다.");
        }

        String sanitizedContent = htmlSanitizer.sanitize(boardDto.getContent());
        boardDto.setIdx(id);
        boardDto.setContent(sanitizedContent);
        boardMapper.updateBoard(boardDto);
    }

    public void deleteBoard(int id, String currentUserId, String userRole) {
        BoardDto existingBoard = boardMapper.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        if (!existingBoard.getWriter().equals(currentUserId) && !"ADMIN".equals(userRole)) {
            throw new AccessDeniedException("삭제 권한이 없습니다.");
        }
        boardMapper.deleteBoard(id);
    }
}