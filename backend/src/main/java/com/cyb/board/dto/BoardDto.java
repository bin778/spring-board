package com.cyb.board.dto;

import lombok.Data;

@Data
public class BoardDto {
    private int idx;
    private String title;
    private String content;
    private String writer;
    private String fileUrl;
    private String created;
    private String lastUpdated;
}