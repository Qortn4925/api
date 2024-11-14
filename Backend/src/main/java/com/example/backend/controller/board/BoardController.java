package com.example.backend.controller.board;

import com.example.backend.dto.board.Board;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/board")
@RequiredArgsConstructor
public class BoardController {

    @PostMapping("add")
    public void add(@RequestBody Board board) {
        System.out.println(board);
    }

}
