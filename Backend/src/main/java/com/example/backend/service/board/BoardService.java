package com.example.backend.service.board;

import com.example.backend.dto.board.Board;
import com.example.backend.dto.board.BoardFile;
import com.example.backend.mapper.board.BoardMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
@Transactional    // 한 번에  성공 또는 실패해야 하니까 
@RequiredArgsConstructor  // 매퍼 생성해야 해서
public class BoardService {

    final BoardMapper mapper;

    final S3Client s3;

    @Value("${image.src.prefix}")
    String imageSrcPrefix;

    @Value("${bucket.name}")
    String bucketName;

    public boolean add(Board board, MultipartFile[] files, Authentication authentication) {
        board.setWriter(authentication.getName());
        int cnt = mapper.insert(board);


        // 아직 id가 없어서 받아 올수 없어서   후에 실행해야함 (게시판 생성 전이니까)

        if (files != null && files.length > 0) {
            // 폴더 만들기
//            String directory = STR."C:/Temp/prj1114/\{board.getId()}";
//            File dir = new File(directory);
//            if (!dir.exists()) {
//                dir.mkdirs();
//            }

            // TODO: local > aws ,
            for (MultipartFile file : files) {
//                 아직 디렉토리가  업성서 , 폴더 미리 만들어야함 , LOCAL
//                String filePath = STR."C:/Temp/prj1114/\{board.getId()}/\{file.getOriginalFilename()}";
//                try {
//                    file.transferTo(new File(filePath));
//                } catch (IOException e) {
//
//                    throw new RuntimeException(e);
//                }
                //AWS
                String objectKey = STR."prj1114/\{board.getId()}/\{file.getOriginalFilename()}";
                PutObjectRequest por = PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(objectKey)
                        .acl(ObjectCannedACL.PUBLIC_READ)
                        .build();


                try {
                    s3.putObject(por, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
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
        List<String> fileNameList = mapper.selectFilesByBoardId(id);
        // 서버 주소 추가하기
        //  http://172.30.1.73:8081/id/+ file name
        List<BoardFile> fileSrcList = fileNameList.stream()
                .map(name -> new BoardFile(name, STR."\{imageSrcPrefix}/\{id}/\{name}"))
                .toList();
        board.setFileSrc(fileSrcList);
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
