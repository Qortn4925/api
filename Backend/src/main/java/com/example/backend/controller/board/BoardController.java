package com.example.backend.controller.board;

import com.example.backend.dto.board.Board;
import com.example.backend.service.board.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/board")
@RequiredArgsConstructor
public class BoardController {


    final BoardService service;

    //    @RequestBody 어노테이션을 사용하여 클라이언트에서 보내는 JSON 데이터를
//    Java 객체로 변환하여 받을 수 있습니다. 예를 들어,
//    클라이언트에서 사용자 정보를 보내고, 이를 Spring에서 처리하는 예시입니다.
    @PostMapping("add")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> add(Board board,
                                                   Authentication authentication,
                                                   @RequestParam(value = "files[]", required = false) MultipartFile[] files) {


        if (service.validate(board)) {

            if (service.add(board, files, authentication)) {
                return ResponseEntity.ok().body(Map.of("message", Map.of("type", "success",
                                "text", board.getId() + "번 게시물이 등록되었습니다"),
                        "data", board));
            } else {
                return ResponseEntity.internalServerError().body(Map.of("message",
                        Map.of("type",
                                "warning", "text", "게시물 등록이 실패")));
            }
        } else {
            return ResponseEntity.badRequest().body(Map.of("message", Map.of("type", "warning", "text", "제목이나 본문이 비어있을수 없습니다.")));
        }
    }

    @GetMapping("list")
    public Map<String, Object> list(@RequestParam(name = "page", defaultValue = "1") Integer page,
                                    @RequestParam(name = "st", defaultValue = "all") String type,
                                    @RequestParam(name = "sk", defaultValue = "") String keyword
    ) {
//        int boardCount = service.count();
        return service.list(page, type, keyword);
    }

    @GetMapping("view/{id}")
    public Board view(@PathVariable int id) {

        Board board = service.get(id);
        return board;
    }

    @DeleteMapping("delete/{id}")
    @PreAuthorize("isAuthenticated()")  // 로그인 여부(토큰)
    public ResponseEntity<Map<String, Object>> delete(@PathVariable int id, Authentication authentication) {

        if (service.hasAccess(id, authentication)) {
            if (service.remove(id)) {
                return ResponseEntity.ok().body(Map.of("message", Map.of("type", "success", "text", id + "번 게시글이 삭제 되었습니다")));
            } else {
                return ResponseEntity.internalServerError().body(Map.of("message", Map.of("type", "error", "text", "게시글 삭제 중 문제가 발생하였습니다.")));
            }
        } else {
            return ResponseEntity.status(403).body(Map.of("message", Map.of("type", "error", "text", "삭제 권한이 없습니다.")));

        }

    }

    @PutMapping("update")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> update(@RequestBody Board board, Authentication authentication) {

        if (service.hasAccess(board.getId(), authentication)) {
            if (service.validate(board)) {
                if (service.update(board)) {
                    //  ok() > 상태가  200번 대면 >  응답개체본문빌더 객체를 만들어줌 ,  > body  응답 본문에  붙여서 나가는거

                    return ResponseEntity.ok().body(Map.of("message", Map.of("type", "success",
                            "text", board.getId() + "번 게시판 수정이 완료되었습니다."
                    )));
                } else {
                    return ResponseEntity.internalServerError().body(Map.of("message", Map.of("type", "error",
                            "text", board.getId() + "번 게시판 수정 실패!"
                    )));
                }
            } else {
                return ResponseEntity.badRequest().body(Map.of("message", Map.of("type", "warning", "text", "제목이나 본문이 비어있을수 없습니다.")));
            }

        } else {
            return ResponseEntity.status(403).body(Map.of("message", Map.of("type", "error", "text", "수정 권한이 없습니다.")));

        }


    }
}
