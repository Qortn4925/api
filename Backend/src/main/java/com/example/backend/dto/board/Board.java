package com.example.backend.dto.board;


import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class Board {
    private int id;
    private String title;
    private String content;
    private String writer;
    private LocalDateTime inserted;
    private Integer countComment;
    private Integer countFile;
    private Integer countLike;
    private List<BoardFile> fileSrc;

}
