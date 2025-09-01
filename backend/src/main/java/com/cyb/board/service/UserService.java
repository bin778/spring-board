package com.cyb.board.service;

import com.cyb.board.dto.UserDto;
import com.cyb.board.mapper.UserMapper;
import com.cyb.board.util.PasswordUtil;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserMapper userMapper;
    private final HttpSession httpSession;

    public void register(UserDto userDto) {
        String hashedPassword = PasswordUtil.hash(userDto.getPwd());
        userDto.setPwd(hashedPassword);
        userMapper.insertUser(userDto);
    }

    public UserDto login(String id, String rawPassword) {
        UserDto user = userMapper.findById(id).orElse(null);
        if (user == null) return null;

        String hashedPassword = PasswordUtil.hash(rawPassword);
        if (user.getPwd().equals(hashedPassword)) {
            httpSession.setAttribute("loginUser", user);
            return user;
        }
        return null;
    }

    public UserDto getUserById(String id) {
        return userMapper.findById(id).orElse(null);
    }

    public void updateUser(UserDto userDto) {
        // 비밀번호가 비어있지 않은 경우에만 해싱하여 업데이트
        if (userDto.getPwd() != null && !userDto.getPwd().trim().isEmpty()) {
            userDto.setPwd(PasswordUtil.hash(userDto.getPwd()));
        } else {
            // 비밀번호가 비어있으면 기존 비밀번호를 사용
            UserDto existingUser = userMapper.findById(userDto.getId()).orElseThrow();
            userDto.setPwd(existingUser.getPwd());
        }
        userMapper.updateUser(userDto);
    }

    public void deleteUser(String id) {
        userMapper.deleteUser(id);
    }

    public Map<String, Object> getUserListAndCounts() {
        List<UserDto> userList = userMapper.selectAllUsers();
        int totalCount = userMapper.getTotalUserCount();
        int todayCount = userMapper.getTodayRegisteredUserCount();

        Map<String, Object> result = new HashMap<>();
        result.put("userList", userList);
        result.put("totalCount", totalCount);
        result.put("todayCount", todayCount);
        return result;
    }
}