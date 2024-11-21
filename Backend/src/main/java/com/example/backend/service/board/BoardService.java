package com.example.backend.service.board;

import com.example.backend.dto.board.Board;
import com.example.backend.mapper.board.BoardMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Map;

@Service
@Transactional    // 한 번에  성공 또는 실패해야 하니까 
@RequiredArgsConstructor  // 매퍼 생성해야 해서
public class BoardService {

    final BoardMapper mapper;

    public boolean add(Board board, MultipartFile[] files, Authentication authentication) {
        board.setWriter(authentication.getName());
        int cnt = mapper.insert(board);


        // 아직 id가 없어서 받아 올수 없어서   후에 실행해야함 (게시판 생성 전이니까)
        if (files != null && files.length > 0) {
            // 폴더 만들기
            String directory = STR."C:/Temp/prj1114/\{board.getId()}";
            File dir = new File(directory);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            // TODO: local > aws ,
            for (MultipartFile file : files) {
//                 아직 디렉토리가  업성서 , 폴더 미리 만들어야함
                String filePath = STR."C:/Temp/prj1114/\{board.getId()}/\{file.getOriginalFilename()}";
                try {
                    file.transferTo(new File(filePath));
                } catch (IOException e) {

                    throw new RuntimeException(e);
                }
                // id 와  , 파일 이름
                mapper.insertFile(board.getId(), file.getOriginalFilename());
            }

        }


        return cnt == 1;
//        return false;
    }

    public Map<String, Object> list(Integer page, String type, String keyword) {

        return Map.of("list", mapper.selectPage((page - 1) * 10, type, keyword), "count", mapper.countAll(type, keyword));

    }

    public Board get(int id) {
        // file 추가하면서 바뀜

        Board board = mapper.selectById(id);
        board.setFileSrc(mapper.selectFilesByBoardId(id));
        return board;
    }

    public boolean validate(Board board) {

        boolean title = board.getTitle().trim().length() > 0;
        boolean content = board.getContent().trim().length() > 0;

        return title && content;
    }

    public boolean remove(int id) {
        int cnt = mapper.deleteById(id);
        return cnt == 1;
    }

    public boolean update(Board board) {
        int cnt = mapper.update(board);
        return cnt == 1;
    }

    public boolean hasAccess(int id, Authentication authentication) {
        Board board = mapper.selectById(id);

        return board.getWriter().equals(authentication.getName());
    }

    ;
}
