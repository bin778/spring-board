package com.cyb.board.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // /files/** 경로로 오는 요청을 실제 파일 시스템의 uploadDir 경로와 매핑
        registry.addResourceHandler("/files/**")
                .addResourceLocations("file:" + uploadDir);
    }
}