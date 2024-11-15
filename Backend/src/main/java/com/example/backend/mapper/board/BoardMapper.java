package com.example.backend.mapper.board;

import com.example.backend.dto.board.Board;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface BoardMapper {

    // #{title} 로 작성하는 이유 ? > sqlInjection 공격 에 취약
    // #{title}은 Board 객체의 title 속성에 해당하는 값을 SQL 쿼리에 삽입하게 됩니다.
    @Insert("""
                        INSERT INTO board
                        (title,content,writer)
            values (#{title},#{content},#{writer})
            """)
    @Options(keyProperty = "id", useGeneratedKeys = true)
    int insert(Board board);

    @Select("""
            <script>
                SELECT id, title, writer, inserted
                FROM board
                WHERE 
                    <trim prefixOverrides="OR">
                        <if test="searchType == 'all' or searchType == 'title'">
                            title LIKE CONCAT('%', #{keyword}, '%')
                        </if>
                        <if test="searchType == 'all' or searchType == 'content'">
                         OR content LIKE CONCAT('%', #{keyword}, '%')
                        </if>
                    </trim>
            
                ORDER BY id DESC
                LIMIT #{offset}, 10
            </script>
            """)
    List<Board> selectPage(Integer offset, String searchType, String keyword);

    @Select("""
            select * 
            from board
            where  id=#{id}
            """)
    Board selectById(int id);

    @Delete("""
                delete from board
                where id=#{id}
            """)
    int deleteById(int id);

    @Update("""
                    update board
                    set title=#{title}, content=#{content}
                    where id=#{id}
            """)
    int update(Board board);

    @Select("""
                    select count(*)
                    from board
            """)
    int countAll();
}
