package com.example.backend.dto.comment;

import lombok.Data;

@Data
public class Comment {
    private String comment;
    private String memberId;  //authentication
    private String boardId;  // 화면 ?
}
