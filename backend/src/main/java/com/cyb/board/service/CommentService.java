package com.cyb.board.service;

import com.cyb.board.dto.CommentDto;
import com.cyb.board.mapper.CommentMapper;
import lombok.RequiredArgsConstructor;
import org.owasp.html.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentMapper commentMapper;
    private final PolicyFactory htmlSanitizer = Sanitizers.FORMATTING.and(Sanitizers.BLOCKS);

    public List<CommentDto> getCommentsByBoardId(long boardId) {
        return commentMapper.findByBoardId(boardId);
    }

    public void createComment(CommentDto commentDto) {
        commentDto.setContent(htmlSanitizer.sanitize(commentDto.getContent()));
        commentMapper.save(commentDto);
    }

    public void updateComment(long id, CommentDto commentDto, String currentUserId, String userRole) {
        CommentDto existingComment = commentMapper.findById(id).orElseThrow();
        if (!existingComment.getWriter().equals(currentUserId) && !"ADMIN".equals(userRole)) {
            throw new AccessDeniedException("수정 권한이 없습니다.");
        }
        commentDto.setIdx(id);
        commentDto.setContent(htmlSanitizer.sanitize(commentDto.getContent()));
        commentMapper.update(commentDto);
    }

    public void deleteComment(long id, String currentUserId, String userRole) {
        CommentDto existingComment = commentMapper.findById(id).orElseThrow();
        if (!existingComment.getWriter().equals(currentUserId) && !"ADMIN".equals(userRole)) {
            throw new AccessDeniedException("삭제 권한이 없습니다.");
        }
        commentMapper.delete(id);
    }
}