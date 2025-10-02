package com.cyb.board.mapper;

import com.cyb.board.dto.BoardDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface BoardMapper {
    void insertBoard(BoardDto board);
    List<BoardDto> findWithPagingAndSearch(@Param("offset") int offset, @Param("pageSize") int pageSize, @Param("search") String search);
    int count(@Param("search") String search);
    Optional<BoardDto> findById(int id);
    void updateBoard(BoardDto board);
    void deleteBoard(int id);
    List<BoardDto> findWithChosungSearch(@Param("offset") int offset, @Param("pageSize") int pageSize, @Param("search") String search);
    int countWithChosungSearch(@Param("search") String search);
    List<BoardDto> findAllForExcel();
}