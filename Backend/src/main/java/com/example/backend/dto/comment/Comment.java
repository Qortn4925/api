package com.example.backend.dto.comment;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Comment {
    private Integer id;
    private String comment;
    private String memberId;  //authentication
    private String boardId;  // 화면 ?
    private LocalDateTime inserted;
}
