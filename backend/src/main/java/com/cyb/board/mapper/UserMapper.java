package com.cyb.board.mapper;

import com.cyb.board.dto.UserDto;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;
import java.util.Optional;

@Mapper
public interface UserMapper {
    void insertUser(UserDto user);
    Optional<UserDto> findById(String id);
    void updateUser(UserDto user);
    void deleteUser(String id);
    List<UserDto> selectAllUsers();
    int getTotalUserCount();
    int getTodayRegisteredUserCount();
}