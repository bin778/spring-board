package com.cyb.board.service;

import com.cyb.board.dto.BoardDto;
import com.cyb.board.mapper.BoardMapper;
import lombok.RequiredArgsConstructor;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.owasp.html.PolicyFactory;
import org.owasp.html.Sanitizers;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Pattern;
import org.apache.poi.ss.usermodel.*;
import java.io.*;

@Service
@RequiredArgsConstructor
public class BoardService {

    private final BoardMapper boardMapper;
    private final PolicyFactory htmlSanitizer = Sanitizers.FORMATTING.and(Sanitizers.BLOCKS).and(Sanitizers.IMAGES).and(Sanitizers.STYLES);
    private static final Pattern CHOSUNG_PATTERN = Pattern.compile("^[ㄱ-ㅎ]+$");

    public void createBoard(BoardDto boardDto) {
        String sanitizedContent = htmlSanitizer.sanitize(boardDto.getContent());
        boardDto.setContent(sanitizedContent);
        boardMapper.insertBoard(boardDto);
    }

    public Page<BoardDto> getBoards(Pageable pageable, String search) {
        int offset = (int) pageable.getOffset();
        int pageSize = pageable.getPageSize();
        List<BoardDto> boards;
        int total;

        if (search != null && CHOSUNG_PATTERN.matcher(search).matches()) {
            // 검색어가 초성으로만 이루어진 경우
            boards = boardMapper.findWithChosungSearch(offset, pageSize, search);
            total = boardMapper.countWithChosungSearch(search);
        } else {
            // 그 외의 경우 (완성형 한글, 영어, 숫자, null 등)
            boards = boardMapper.findWithPagingAndSearch(offset, pageSize, search);
            total = boardMapper.count(search);
        }
        return new PageImpl<>(boards, pageable, total);
    }

    public Optional<BoardDto> getBoardById(int id) {
        return boardMapper.findById(id);
    }

    public void updateBoard(int id, BoardDto boardDto, String currentUserId, String userRole) {
        BoardDto existingBoard = boardMapper.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        if (!existingBoard.getWriter().equals(currentUserId) && !"ADMIN".equals(userRole)) {
            throw new AccessDeniedException("수정 권한이 없습니다.");
        }

        String sanitizedContent = htmlSanitizer.sanitize(boardDto.getContent());
        boardDto.setIdx(id);
        boardDto.setContent(sanitizedContent);
        boardMapper.updateBoard(boardDto);
    }

    public void deleteBoard(int id, String currentUserId, String userRole) {
        BoardDto existingBoard = boardMapper.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        if (!existingBoard.getWriter().equals(currentUserId) && !"ADMIN".equals(userRole)) {
            throw new AccessDeniedException("삭제 권한이 없습니다.");
        }
        boardMapper.deleteBoard(id);
    }

    public void writeBoardsToExcel(OutputStream outputStream) throws IOException {
        List<BoardDto> boards = boardMapper.findAllForExcel();

        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("게시물 목록");

            String[] headers = {"번호", "제목", "내용", "작성자", "작성일", "IP 주소", "첨부파일"};
            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
            }

            for (int i = 0; i < boards.size(); i++) {
                BoardDto board = boards.get(i);
                Row row = sheet.createRow(i + 1);

                row.createCell(0).setCellValue(board.getIdx());
                row.createCell(1).setCellValue(board.getTitle());
                String cleanContent = cleanContentForExcel(board.getContent());
                row.createCell(2).setCellValue(cleanContent);
                row.createCell(3).setCellValue(board.getWriter());
                row.createCell(4).setCellValue(board.getCreated());
                row.createCell(5).setCellValue(board.getIpAddress());

                String fileLink = "";
                if (board.getFileUrl() != null && board.getOriginalFileName() != null) {
                    fileLink = "http://localhost:8080/api/files/download/" + board.getFileUrl() + "?originalFileName=" + board.getOriginalFileName();
                }
                row.createCell(6).setCellValue(fileLink);
            }

            workbook.write(outputStream);
        }
    }

    private String cleanContentForExcel(String htmlContent) {
        if (htmlContent == null) return "";
        String contentWithLinks = htmlContent.replaceAll("<img src=\"([^\"]+)\"[^>]*>", "$1 ");
        return contentWithLinks.replaceAll("<[^>]+>", "");
    }
}