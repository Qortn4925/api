package com.example.backend.service.member;

import com.example.backend.dto.member.Member;
import com.example.backend.dto.member.MemberEdit;
import com.example.backend.mapper.member.MemberMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberService {
    final MemberMapper mapper;

    public boolean signUp(Member member) {
        int cnt = mapper.signUp(member);
        return cnt == 1;
    }

    public boolean checkId(String id) {
        return id == mapper.check(id);
    }

    public List<Member> list() {
        return mapper.selectAll();
    }

    public Member get(String id) {
        return mapper.selectById(id);
    }


    public boolean remove(Member member) {
        int cnt = 0;

        // 기존 암호와 비교
        Member db = mapper.selectById(member.getId());

        if (db != null) {
            if (db.getPassword().equals(member.getPassword())) {
                cnt = mapper.deleteById(member.getId());
            }
        }
        return cnt == 1;

    }

    public boolean update(MemberEdit member) {
        int cnt = 0;
        Member db = mapper.selectById(member.getId());
        if (db != null) {
            // 기존 아이디의 password 와 ,   새로 받아온 정보의 비밀번호가 같을 시에만 수행
            if (db.getPassword().equals(member.getOldPassword())) {
                cnt = mapper.updateById(member);
            }
        }
        return cnt == 1;

    }
}
