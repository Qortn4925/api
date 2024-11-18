package com.example.backend.mapper.member;

import com.example.backend.dto.member.Member;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

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
}
