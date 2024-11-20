package com.example.backend.service.comment;

import com.example.backend.dto.comment.Comment;
import com.example.backend.mapper.comment.CommentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class CommentService {

    final CommentMapper mapper;


    public void add(Comment comment, Authentication authentication) {
        comment.setMemberId(authentication.getName());
        mapper.insert(comment);
    }

    public List<Comment> list(Integer boardId) {
        return mapper.selectByBoardId(boardId);
    }

    public boolean hasAccess(int id, Authentication auth) {
        Comment comment = mapper.selectByID(id);
        return comment.getMemberId().equals(auth.getName());
    }

    public void remove(int id) {
        mapper.deleteById(id);
    }

    public boolean update(Comment comment) {
        int cnt = mapper.update(comment);
        return cnt == 1;
    }
}
