package com.example.backend.mapper.comment;

import com.example.backend.dto.comment.Comment;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface CommentMapper {


    @Insert("""
                        INSERT INTO  comment(board_id,member_id,comment)
            values (#{boardId},#{memberId},#{comment})
            """)
    int insert(Comment comment);


    @Select("""
                select *
                from comment
                where board_id=#{boardId}
                order by id desc
            """)
    List<Comment> selectByBoardId(Integer boardId);


    @Select("""
                select *
                from comment
                where id=#{id}
            """)
    Comment selectByID(int id);

    @Delete("""
                delete from comment
                where id=#{id}
            """)
    int deleteById(int id);

    @Update("""
                        update comment set comment=#{comment}
            where id=#{id}
            """)
    int update(Comment comment);
}
