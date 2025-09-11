package com.cyb.board.service;

import com.cyb.board.dto.UserDto;
import com.cyb.board.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final EncryptionService encryptionService;

    public void register(UserDto userDto) {
        userDto.setPwd(passwordEncoder.encode(userDto.getPwd()));
        encryptUserFields(userDto);
        userMapper.insertUser(userDto);
    }

    public Optional<UserDto> getUserById(String id) {
        return userMapper.findById(id).map(this::decryptUserFields);
    }

    public List<UserDto> selectAllUsers() {
        return userMapper.selectAllUsers().stream()
                .map(this::decryptUserFields)
                .collect(Collectors.toList());
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
        encryptUserFields(userDto);
        userMapper.updateUser(userDto);
    }

    private void encryptUserFields(UserDto user) {
        if (StringUtils.hasText(user.getName())) {
            user.setName(encryptionService.encrypt(user.getName()));
        }
        if (StringUtils.hasText(user.getPhone())) {
            user.setPhone(encryptionService.encrypt(user.getPhone()));
        }
        if (StringUtils.hasText(user.getAddress())) {
            user.setAddress(encryptionService.encrypt(user.getAddress()));
        }
    }

    private UserDto decryptUserFields(UserDto user) {
        if (StringUtils.hasText(user.getName())) {
            user.setName(encryptionService.decrypt(user.getName()));
        }
        if (StringUtils.hasText(user.getPhone())) {
            user.setPhone(encryptionService.decrypt(user.getPhone()));
        }
        if (StringUtils.hasText(user.getAddress())) {
            user.setAddress(encryptionService.decrypt(user.getAddress()));
        }
        return user;
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