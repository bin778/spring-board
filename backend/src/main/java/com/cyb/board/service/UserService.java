package com.cyb.board.service;

import com.cyb.board.dto.UserDto;
import com.cyb.board.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public void register(UserDto userDto) {
        userDto.setPwd(passwordEncoder.encode(userDto.getPwd()));
        userMapper.insertUser(userDto);
    }

    public Optional<UserDto> getUserById(String id) {
        return userMapper.findById(id);
    }

    public List<UserDto> selectAllUsers() {
        return userMapper.selectAllUsers();
    }

    public int getTotalUserCount() {
        return userMapper.getTotalUserCount();
    }

    public int getTodayRegisteredUserCount() {
        return userMapper.getTodayRegisteredUserCount();
    }

    public void deleteUser(String id) {
        userMapper.deleteUser(id);
    }

    public void updateUser(UserDto userDto) {
        if (userDto.getPwd() != null && !userDto.getPwd().trim().isEmpty()) {
            userDto.setPwd(passwordEncoder.encode(userDto.getPwd()));
        } else {
            userMapper.findById(userDto.getId())
                    .ifPresent(existingUser -> userDto.setPwd(existingUser.getPwd()));
        }
        userMapper.updateUser(userDto);
    }

    public Map<String, Object> getUserListAndCounts() {
        List<UserDto> userList = selectAllUsers();
        int totalCount = getTotalUserCount();
        int todayCount = getTodayRegisteredUserCount();

        Map<String, Object> response = new HashMap<>();
        response.put("userList", userList);
        response.put("totalCount", totalCount);
        response.put("todayCount", todayCount);

        return response;
    }
}