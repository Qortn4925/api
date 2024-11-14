package com.example.backend.service.board;

import com.example.backend.dto.board.Board;
import com.example.backend.mapper.board.BoardMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@Transactional    // 한 번에  성공 또는 실패해야 하니까 
@RequiredArgsConstructor  // 매퍼 생성해야 해서
public class BoardService {

    final BoardMapper mapper;

    public Map<String, Object> add(Board board) {
        int cnt = mapper.insert(board);

        if (cnt == 1) {
            return Map.of("message", Map.of("type", "success",
                            "text", board.getId() + "번 게시물이 등록되었습니다"),
                    "data", board);
        } else {
            return null;
        }
    }

    public List<Board> list() {
        return mapper.selectAll();
    }

    public Board get(int id) {

        return mapper.selectById(id);
    }

    ;
}
