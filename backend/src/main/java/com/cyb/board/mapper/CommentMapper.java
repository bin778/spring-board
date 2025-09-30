package com.cyb.board.mapper;

import com.cyb.board.dto.CommentDto;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Optional;

@Mapper
public interface CommentMapper {
    List<CommentDto> findByBoardId(long boardId);
    Optional<CommentDto> findById(long id);
    void save(CommentDto comment);
    void update(CommentDto comment);
    void delete(long id);
}