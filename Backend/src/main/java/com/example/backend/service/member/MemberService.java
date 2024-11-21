package com.example.backend.service.member;

import com.example.backend.dto.member.Member;
import com.example.backend.dto.member.MemberEdit;
import com.example.backend.mapper.board.BoardMapper;
import com.example.backend.mapper.comment.CommentMapper;
import com.example.backend.mapper.member.MemberMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberService {
    final MemberMapper mapper;
    final JwtEncoder jwtEncoder;
    private final CommentMapper commentMapper;
    private final BoardMapper boardMapper;


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
                // 댓글 지우기
                commentMapper.deleteByMemberId(member.getId());
                // 게시글 지우기 , 리스트로 받고 , 아이디로 삭제 ?>
                // 쓴 게시물 목록 얻고 > 지우기
                List<Integer> boards = boardMapper.selectByWriter(member.getId());
                for (Integer boardId : boards) {
                    boardMapper.deleteById(boardId);
                }

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

    public boolean checkEmail(String email) {
        Member member = mapper.selectByEmail(email);
        return member != null;
    }

    public String token(Member member) {
        Member db = mapper.selectById(member.getId());
        // auth 권한 별로 없어서 그냥 멤버에 합침
        // 토큰 만들때 다 받아와서 , 주는거임 (권한이 여러개 ) 일 수도 있으니까
        List<String> auths = mapper.selectAuthByMemberId(member.getId());
        String authsString = auths.stream()
                .collect(Collectors.joining(" "));

        if (db != null) {
            if (db.getPassword().equals(member.getPassword())) {
                // token 만들어서 리턴
                JwtClaimsSet claims = JwtClaimsSet.builder()
                        .issuer("self")
                        .subject(member.getId())
                        .issuedAt(Instant.now())
                        .expiresAt(Instant.now().plusSeconds(60 * 60 * 24 * 7))
                        .claim("scope", authsString)
                        .build();
                return jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
            }
        }
        return null;
    }

    public boolean hasAccess(String id, Authentication authentication) {

        return id.equals(authentication.getName());
    }

    public boolean isAdmin(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .map(a -> a.toString())
                .anyMatch(s -> s.equals("SCOPE_admin"));
    }
}
