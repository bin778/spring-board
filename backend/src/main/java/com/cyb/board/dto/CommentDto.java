package com.cyb.board.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CommentDto {
    private long idx;
    private long boardIdx;
    private String content;
    private String writer;
    private LocalDateTime createdDate;
}