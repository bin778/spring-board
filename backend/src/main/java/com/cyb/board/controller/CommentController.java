package com.cyb.board.controller;

import com.cyb.board.dto.CommentDto;
import com.cyb.board.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/boards/{boardId}/comments")
    public ResponseEntity<List<CommentDto>> getComments(@PathVariable long boardId) {
        return ResponseEntity.ok(commentService.getCommentsByBoardId(boardId));
    }

    @PostMapping("/boards/{boardId}/comments")
    public ResponseEntity<Void> createComment(@PathVariable long boardId, @RequestBody CommentDto commentDto, Authentication authentication) {
        commentDto.setBoardIdx(boardId);
        commentDto.setWriter(authentication.getName());
        commentService.createComment(commentDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/comments/{commentId}")
    public ResponseEntity<Void> updateComment(@PathVariable long commentId, @RequestBody CommentDto commentDto, Authentication authentication) {
        String currentUserId = authentication.getName();
        String userRole = authentication.getAuthorities().stream().findFirst().map(GrantedAuthority::getAuthority).orElse("").replace("ROLE_", "");
        commentService.updateComment(commentId, commentDto, currentUserId, userRole);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable long commentId, Authentication authentication) {
        String currentUserId = authentication.getName();
        String userRole = authentication.getAuthorities().stream().findFirst().map(GrantedAuthority::getAuthority).orElse("").replace("ROLE_", "");
        commentService.deleteComment(commentId, currentUserId, userRole);
        return ResponseEntity.ok().build();
    }
}