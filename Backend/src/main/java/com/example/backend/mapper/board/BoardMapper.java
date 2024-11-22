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
                SELECT b.id, b.title, b.writer, b.inserted ,count(distinct  c.id) as countComment ,count(DISTINCT f.name) as countFile
                FROM 
                    board b left join comment c on b.id=c.board_id
                    left join board_file f 
                        on b.id=f.board_id
                WHERE 
                    <trim prefixOverrides="OR">
                        <if test="searchType == 'all' or searchType == 'title'">
                            title LIKE CONCAT('%', #{keyword}, '%')
                        </if>
                        <if test="searchType == 'all' or searchType == 'content'">
                         OR content LIKE CONCAT('%', #{keyword}, '%')
                        </if>
                    </trim>
               GROUP BY b.id
                ORDER BY b.id DESC
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
            <script>
            SELECT COUNT(*) FROM board
            WHERE 
                <trim prefixOverrides="OR">
                    <if test="searchType == 'all' or searchType == 'title'">
                        title LIKE CONCAT('%', #{keyword}, '%')
                    </if>
                    <if test="searchType == 'all' or searchType == 'content'">
                     OR content LIKE CONCAT('%', #{keyword}, '%')
                    </if>
                </trim>
            </script>
            """)
    Integer countAll(String searchType, String keyword);

    @Insert("""
                Insert into board_file
                values (#{id},#{fileName})
            """)
    int insertFile(int id, String fileName);


    @Select("""
                    select name
                    from board_file
                    where board_id=#{id}
            """)
    List<String> selectFilesByBoardId(int id);

    @Delete("""
                    delete from board_file
                    where board_id=#{id}
            """)
    int deleteFileByBoardId(int id);

    @Select("""
                    select id
                    from board
                    where writer=#{id}
            """)
    List<Integer> selectByWriter(String id);

    @Delete("""
            DELETE FROM board_file
            WHERE board_id = #{id}
              AND name = #{name}
            """)
    void deleteFileByBoardIdAndName(int id, String name);
}
