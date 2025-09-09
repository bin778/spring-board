package com.cyb.board.service;

import com.cyb.board.dto.BoardDto;
import com.cyb.board.mapper.BoardMapper;
import lombok.RequiredArgsConstructor;
import org.owasp.html.PolicyFactory;
import org.owasp.html.Sanitizers;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BoardService {

    private final BoardMapper boardMapper;

    public void createBoard(BoardDto boardDto) {
        PolicyFactory policy = Sanitizers.FORMATTING.and(Sanitizers.BLOCKS)
                .and(Sanitizers.IMAGES).and(Sanitizers.STYLES);

        String sanitizedContent = policy.sanitize(boardDto.getContent());
        boardDto.setContent(sanitizedContent);

        boardMapper.insertBoard(boardDto);
    }
}