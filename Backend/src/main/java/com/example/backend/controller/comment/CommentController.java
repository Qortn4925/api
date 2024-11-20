package com.example.backend.controller.comment;


import com.example.backend.dto.comment.Comment;
import com.example.backend.service.comment.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comment")
@RequiredArgsConstructor
public class CommentController {


    final CommentService service;

    @PutMapping("edit")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> edit(@RequestBody Comment comment) {
        System.out.println("comment = " + comment);
        System.out.println(comment);
        if (service.update(comment)) {
            return ResponseEntity.ok().body(Map.of
                    ("message",
                            Map.of("type", "success",
                                    "text", "댓글이 수정 되었습니다.")));
        } else {
            return ResponseEntity.ok().body(Map.of
                    ("message",
                            Map.of("type", "success",
                                    "text", "댓글 수정 xx")));
        }
    }

    @DeleteMapping("remove/{id}")
    @PreAuthorize("isAuthenticated()")
    public void remove(@PathVariable int id, Authentication auth) {
        if (service.hasAccess(id, auth)) {
            service.remove(id);
        }

    }

    @GetMapping("list/{boardId}")
    public List<Comment> list(@PathVariable Integer boardId) {
        List<Comment> list = service.list(boardId);
        return list;
    }

    @PostMapping("add")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> add(@RequestBody Comment comment, Authentication authentication) {
        service.add(comment, authentication);
        return ResponseEntity.ok().body(Map.of
                ("message",
                        Map.of("type", "success",
                                "text", "새 댓글이 등록되었습니다.")));
    }
}
