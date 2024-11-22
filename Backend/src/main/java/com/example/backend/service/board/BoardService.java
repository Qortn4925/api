package com.example.backend.service.board;

import com.example.backend.dto.board.Board;
import com.example.backend.dto.board.BoardFile;
import com.example.backend.mapper.board.BoardMapper;
import com.example.backend.mapper.comment.CommentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
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
    final CommentMapper commentMapper;

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
        // 테이블을 봐서 , 상세하게 바꿀 필요가 있다
        List<String> fileName = mapper.selectFilesByBoardId(id);
        // 첨부파일 , 댓글 을 지워 줘야 함
        for (String file : fileName) {
            String key = STR."prj1114/\{id}/\{file}";
            DeleteObjectRequest dor = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();

            s3.deleteObject(dor);
        }
        //db상
        mapper.deleteFileByBoardId(id);
        // 실제 파일 > s3 파일,  database 상에 데이ㅓ 지우기

        // 댓글 지우기
        commentMapper.deleteByBoardId(id);

        // 좋아요 지우기
        mapper.deleteLikeByBoardId(id);

        int cnt = mapper.deleteById(id);
        return cnt == 1;
    }

    public boolean update(Board board, List<String> removeFiles, MultipartFile[] uploadFiles) {
        if (removeFiles != null) {
            for (String file : removeFiles) {
                String key = STR."prj1114/\{board.getId()}/\{file}";
                DeleteObjectRequest dor = DeleteObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .build();

                // s3 파일 지우기
                s3.deleteObject(dor);

                // db 파일 지우기
                mapper.deleteFileByBoardIdAndName(board.getId(), file);
            }
        }

        if (uploadFiles != null && uploadFiles.length > 0) {
            for (MultipartFile file : uploadFiles) {
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

                // board_file 테이블에 파일명 입력
                mapper.insertFile(board.getId(), file.getOriginalFilename());
            }
        }


        int cnt = mapper.update(board);
        return cnt == 1;
    }

    public boolean hasAccess(int id, Authentication authentication) {
        Board board = mapper.selectById(id);

        return board.getWriter().equals(authentication.getName());
    }

    public Map<String, Object> like(Board board, Authentication authentication) {
        // 이미 눌러져있으면 , 삭제 , 아니면 추가 > table에  아이디가 이름이 없으면 삭제 인거 아닌가
        int cnt = mapper.deleteLikeByBoardIdAndMemberId(board.getId(), authentication.getName());
        System.out.println("실행확인 ");
        // 아니면 삽입
        // 삭제 1,  아니면 0
        if (cnt == 0) {
            mapper.insertLike(board.getId(), authentication.getName());
            System.out.println("insert 동작");
        }
        int countLike = mapper.countLike(board.getId());
        Map<String, Object> result = Map.of("like", (cnt == 0), "count", countLike);
        return result;
    }


    public Map<String, Object> getLike(int id, Authentication auth) {
        boolean like = false;
        if (auth == null) {

        } else {
            Map<String, Object> row = mapper.selectLikeByBoardIdAndMemberId(id, auth.getName());
            if (row != null) {
                like = true;
            }
        }
        int countLike = mapper.countLike(id);
        Map<String, Object> result = Map.of("like", (like), "count", countLike);
        return result;
    }
}
