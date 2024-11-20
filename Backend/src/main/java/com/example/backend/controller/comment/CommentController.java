package com.example.backend.controller.comment;


import com.example.backend.dto.comment.Comment;
import com.example.backend.service.comment.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comment")
@RequiredArgsConstructor
public class CommentController {


    final CommentService service;

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
    public void add(@RequestBody Comment comment, Authentication authentication) {
        service.add(comment, authentication);
    }
}
