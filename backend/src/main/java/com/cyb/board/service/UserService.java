package com.cyb.board.service;

import com.cyb.board.dto.UserDto;
import com.cyb.board.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.*;
import java.util.stream.Collectors;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final EncryptionService encryptionService;

    private static final String PASSWORD_PATTERN = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?]).{8,}$";
    private static final String PHONE_PATTERN = "^\\d{9,11}$";

    public void register(UserDto userDto) {
        if (isValidPassword(userDto.getPwd())) {
            throw new IllegalArgumentException("비밀번호는 최소 8자리 이상이며, 대소문자와 특수문자를 모두 포함해야 합니다.");
        }

        if (StringUtils.hasText(userDto.getPhone()) && isValidPhone(userDto.getPhone())) {
            throw new IllegalArgumentException("전화번호 형식이 올바르지 않습니다. (하이픈(-) 제외)");
        }

        userDto.setPwd(passwordEncoder.encode(userDto.getPwd()));
        encryptUserFields(userDto);
        userMapper.insertUser(userDto);
    }

    public void updateUser(UserDto userDto) {
        if (StringUtils.hasText(userDto.getPwd())) {
            if (isValidPassword(userDto.getPwd())) {
                throw new IllegalArgumentException("비밀번호는 최소 8자리 이상이며, 대소문자와 특수문자를 모두 포함해야 합니다.");
            }
            userDto.setPwd(passwordEncoder.encode(userDto.getPwd()));
        } else {
            userMapper.findById(userDto.getId())
                    .ifPresent(existingUser -> userDto.setPwd(existingUser.getPwd()));
        }

        if (StringUtils.hasText(userDto.getPhone()) && isValidPhone(userDto.getPhone())) {
            throw new IllegalArgumentException("전화번호 형식이 올바르지 않습니다. (하이픈(-) 제외)");
        }

        UserDto encryptedDto = encryptUserFields(userDto);
        userMapper.updateUser(encryptedDto);
    }

    private boolean isValidPassword(String password) {
        if (password == null) return true; // 비밀번호는 null일 수 없음
        return !Pattern.matches(PASSWORD_PATTERN, password);
    }

    private boolean isValidPhone(String phone) {
        if (!StringUtils.hasText(phone)) return false; // 전화번호는 선택 사항이므로 비어있으면 유효
        return !Pattern.matches(PHONE_PATTERN, phone.replaceAll("-", ""));
    }

    private UserDto encryptUserFields(UserDto user) {
        if (StringUtils.hasText(user.getName())) user.setName(encryptionService.encrypt(user.getName()));
        if (StringUtils.hasText(user.getPhone())) user.setPhone(encryptionService.encrypt(user.getPhone()));
        else user.setPhone(null);
        if (StringUtils.hasText(user.getAddress())) user.setAddress(encryptionService.encrypt(user.getAddress()));
        else user.setAddress(null);
        return user;
    }
    private UserDto decryptUserFields(UserDto user) {
        if (StringUtils.hasText(user.getName())) user.setName(encryptionService.decrypt(user.getName()));
        if (StringUtils.hasText(user.getPhone())) user.setPhone(encryptionService.decrypt(user.getPhone()));
        else user.setPhone(null);
        if (StringUtils.hasText(user.getAddress())) user.setAddress(encryptionService.decrypt(user.getAddress()));
        else user.setAddress(null);
        return user;
    }
    public Optional<UserDto> getUserById(String id) {
        return userMapper.findById(id).map(this::decryptUserFields);
    }

    public List<UserDto> selectAllUsers() {
        return userMapper.selectAllUsers().stream().map(this::decryptUserFields).collect(Collectors.toList());
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

    public Map<String, Object> getUserListAndCounts() {
        Map<String, Object> response = new HashMap<>();
        response.put("userList", selectAllUsers());
        response.put("totalCount", getTotalUserCount());
        response.put("todayCount", getTodayRegisteredUserCount());
        return response;
    }
}