package com.example.backend.mapper.board;

import com.example.backend.dto.board.Board;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface BoardMapper {

    // #{title} 로 작성하는 이유 ? > sqlInjection 공격 에 취약
    // #{title}은 Board 객체의 title 속성에 해당하는 값을 SQL 쿼리에 삽입하게 됩니다.
    @Insert("""
                        INSERT INTO board
                        (title,content,writer)
            values (#{title},#{content},#{writer})
            """)
    int insert(Board board);
}
