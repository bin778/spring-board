package com.cyb.board.controller;

import com.cyb.board.dto.UserDto;
import com.cyb.board.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.cyb.board.service.BoardService;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final BoardService boardService;

    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getUserList() {
        Map<String, Object> response = userService.getUserListAndCounts();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable("id") String id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable("id") String id) {
        if ("admin".equals(id)) {
            return ResponseEntity.badRequest().build();
        }
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/users/update")
    public ResponseEntity<String> updateUserByAdmin(@RequestBody UserDto userDto) {
        userService.updateUser(userDto);
        return ResponseEntity.ok("관리자에 의해 정보가 성공적으로 수정되었습니다.");
    }

    @GetMapping("/boards/excel")
    public void downloadBoardsAsExcel(HttpServletResponse response) throws IOException {
        String timeStamp = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
        String fileName = "board_posts_" + timeStamp + ".xlsx";

        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=\"" + fileName + "\"");

        boardService.writeBoardsToExcel(response.getOutputStream());
    }
}