package com.example.backend.controller.board;

import com.example.backend.dto.board.Board;
import com.example.backend.service.board.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/board")
@RequiredArgsConstructor
public class BoardController {


    final BoardService service;

    //    @RequestBody 어노테이션을 사용하여 클라이언트에서 보내는 JSON 데이터를
//    Java 객체로 변환하여 받을 수 있습니다. 예를 들어,
//    클라이언트에서 사용자 정보를 보내고, 이를 Spring에서 처리하는 예시입니다.
    @PostMapping("add")
    public ResponseEntity<Map<String, Object>> add(@RequestBody Board board) {

        if (service.validate(board)) {


            if (service.add(board)) {
                return ResponseEntity.ok().body(Map.of("message", Map.of("type", "success",
                                "text", board.getId() + "번 게시물이 등록되었습니다"),
                        "data", board));
            } else {
                return ResponseEntity.internalServerError().body(Map.of("message",
                        Map.of("type",
                                "warning", "text", "게시물 등록이 실패")));
            }
        } else {
            return ResponseEntity.badRequest().body(Map.of("message", Map.of("type", "warning", "text", "제목이나 본문이 비어있을수 없습니다.")));
        }
    }

    @GetMapping("list")
    public List<Board> list() {
        return service.list();
    }

    @GetMapping("view/{id}")
    public Board view(@PathVariable int id) {

        Board board = service.get(id);
        System.out.println("board = " + board);
        return board;
    }

}
