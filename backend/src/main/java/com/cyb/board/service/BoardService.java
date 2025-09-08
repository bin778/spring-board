package com.cyb.board.service;

import com.cyb.board.dto.BoardDto;
import com.cyb.board.mapper.BoardMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BoardService {

    private final BoardMapper boardMapper;

    public void createBoard(BoardDto boardDto) {
        boardMapper.insertBoard(boardDto);
    }
}