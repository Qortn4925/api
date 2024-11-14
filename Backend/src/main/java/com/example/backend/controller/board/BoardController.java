package com.example.backend.controller.board;

import com.example.backend.dto.board.Board;
import com.example.backend.service.board.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/board")
@RequiredArgsConstructor
public class BoardController {

    final BoardService service;

    //    @RequestBody 어노테이션을 사용하여 클라이언트에서 보내는 JSON 데이터를
//    Java 객체로 변환하여 받을 수 있습니다. 예를 들어,
//    클라이언트에서 사용자 정보를 보내고, 이를 Spring에서 처리하는 예시입니다.
    @PostMapping("add")
    public Board add(@RequestBody Board board) {
        service.add(board);
        return board;
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
