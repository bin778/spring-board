package com.cyb.board.mapper;

import com.cyb.board.dto.BoardDto;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface BoardMapper {
    void insertBoard(BoardDto board);
}