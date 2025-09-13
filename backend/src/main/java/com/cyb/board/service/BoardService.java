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

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BoardService {

    private final BoardMapper boardMapper;
    private final PolicyFactory htmlSanitizer = Sanitizers.FORMATTING.and(Sanitizers.BLOCKS).and(Sanitizers.IMAGES).and(Sanitizers.STYLES);

    public void createBoard(BoardDto boardDto) {
        String sanitizedContent = htmlSanitizer.sanitize(boardDto.getContent());
        boardDto.setContent(sanitizedContent);
        boardMapper.insertBoard(boardDto);
    }

    public Page<BoardDto> getBoards(Pageable pageable, String search) {
        int offset = (int) pageable.getOffset();
        int pageSize = pageable.getPageSize();
        List<BoardDto> boards = boardMapper.findWithPagingAndSearch(offset, pageSize, search);
        int total = boardMapper.count(search);
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