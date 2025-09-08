package com.cyb.board.controller;

import org.apache.commons.io.FilenameUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Objects;
import java.util.UUID;

@RestController
@RequestMapping("/api/files")
public class FileController {

    private static final Logger logger = LoggerFactory.getLogger(FileController.class);

    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        String originalFileName = FilenameUtils.getName(Objects.requireNonNull(file.getOriginalFilename()));

        if (originalFileName.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("유효하지 않은 파일명입니다.");
        }

        String extension = FilenameUtils.getExtension(originalFileName);
        String savedFileName = UUID.randomUUID().toString() + "." + extension;

        try {
            File uploadDirFile = new File(this.uploadDir);
            String canonicalUploadDirPath = uploadDirFile.getCanonicalPath();

            File destinationFile = new File(uploadDirFile, savedFileName);
            String canonicalDestinationPath = destinationFile.getCanonicalPath();

            if (!canonicalDestinationPath.startsWith(canonicalUploadDirPath + File.separator)) {
                logger.warn("경로 조작 공격 시도 감지: {}", originalFileName);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("잘못된 파일 경로입니다.");
            }

            Path destinationPath = destinationFile.toPath();
            if (!Files.exists(destinationPath.getParent())) {
                Files.createDirectories(destinationPath.getParent());
            }
            Files.copy(file.getInputStream(), destinationPath);

            String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/files/")
                    .path(savedFileName)
                    .toUriString();

            return ResponseEntity.ok(fileDownloadUri);

        } catch (IOException e) {
            logger.error("파일 업로드 중 오류 발생. 파일명: {}", originalFileName, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("파일 업로드 중 오류가 발생했습니다.");
        }
    }
}