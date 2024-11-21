package com.example.backend.dto.board;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BoardFile {
    //     경로와 , 파일 이름 저장할 dto
    private String name;
    private String src;
}
