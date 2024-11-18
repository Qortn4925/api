package com.example.backend.mapper.member;

import com.example.backend.dto.member.Member;
import com.example.backend.dto.member.MemberEdit;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface MemberMapper {

    @Insert("""
            INSERT INTO member
            (id, password, description)
            VALUES (#{id}, #{password}, #{description})
            """)
    int signUp(Member member);


    @Select("""
                        select id from member
                        where id=#{id}
            """)
    String check(String id);

    @Select("""
                        select id,inserted 
            from member
            
            """)
    List<Member> selectAll();

    @Select("""
                        select *
                        from member
                        where id=#{id}
            """)
    Member selectById(String id);


    @Delete("""
                delete from member
            where id= #{id}
            """)
    int deleteById(String id);

    @Update("""
                        update member
                        set password=#{password} , description=#{description}
                        where id=#{id} 
            """)
    int updateById(MemberEdit member);
}
