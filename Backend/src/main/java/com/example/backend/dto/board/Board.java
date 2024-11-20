package com.example.backend.dto.board;


import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Board {
    private int id;
    private String title;
    private String content;
    private String writer;
    private LocalDateTime inserted;
    private Integer countComment;

}
