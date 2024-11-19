package com.example.backend.controller.member;

import com.example.backend.dto.member.Member;
import com.example.backend.dto.member.MemberEdit;
import com.example.backend.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/member")
@RequiredArgsConstructor
public class MemberController {
    final MemberService service;

    @PostMapping("login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Member member) {
        // 토큰 만들기
        String token = service.token(member);

        if (token != null) {
            // 로그인 성공
            return ResponseEntity.ok(Map.of("token", token,
                    "message", Map.of("type", "success", "text", "로그인 되었습니다.")
            ));
        } else {
            // 로그인 실패
            return ResponseEntity.status(401).body(Map.of("message", Map.of("type", "warning", "text", "로그인 실패."))
            );

        }
    }

    @PostMapping("signup")
    public ResponseEntity<Map<String, Object>> signup(@RequestBody Member member) {
        System.out.println("member = " + member);
        try {
            if (service.signUp(member)) {
                return ResponseEntity.ok().body(Map.of("message", Map.of("type", "success", "text", "성공")));
            } else {
                return ResponseEntity.badRequest().body(Map.of("message", Map.of("type", "error", "text", "어쩌구 저쩌구")));
            }
        } catch (DuplicateKeyException e) {
            return ResponseEntity.internalServerError().body(Map.of("message", Map.of("type", "error", "text", "이미 존재하는 아이디")));
        }
    }

    @GetMapping(value = "check", params = "id")
    public ResponseEntity<Map<String, Object>> checkid(@RequestParam String id) {
        if (service.checkId(id)) {
            // 이미 있으면
            return ResponseEntity.ok().body(Map.of(
                    "message", Map.of("type", "warning", "text", "이미 사용중인 아이디 입니다."),
                    "available", false)
            );
        } else {
            // 없으면
            return ResponseEntity.ok().body(Map.of(
                    "message", Map.of("type", "info", "text", "사용 가능한 아이디 입니다."),
                    "available", true));
        }
    }

    @GetMapping(value = "check", params = "email")
    public ResponseEntity<Map<String, Object>> checkEmail(@RequestParam String email) {
        if (service.checkEmail(email)) {
            // 이미 있으면
            return ResponseEntity.ok().body(Map.of(
                    "message", Map.of("type", "warning", "text", "이미 사용중인 이메일 입니다."),
                    "available", false)
            );
        } else {
            // 없으면
            return ResponseEntity.ok().body(Map.of(
                    "message", Map.of("type", "info", "text", "사용 가능한 이메일 입니다."),
                    "available", true));
        }
    }


    @GetMapping("list")
    public List<Member> list() {
        return service.list();
    }

    @GetMapping("{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Member> get(@PathVariable String id, Authentication authentication) {
        if (service.hasAccess(id, authentication)) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(403).build();
        }
    }

    @DeleteMapping("remove")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> remove(@RequestBody Member member, Authentication authentication) {

        if (service.hasAccess(member.getId(), authentication)) {
            if (service.remove(member)) {
                //잘됨
                return ResponseEntity.ok(Map.of("message",
                        Map.of("type", "success",
                                "text", "회원정보를 삭제하였습니다.")));
            } else {
                return ResponseEntity.badRequest()
                        .body(Map.of("message",
                                Map.of("type", "warning",
                                        "text", "정확한 정보를 입력해주세요.")));
            }

        } else {
            return ResponseEntity.status(403).build();
        }


    }

    @PutMapping("update")
    public ResponseEntity<Map<String, Object>> edit(@RequestBody MemberEdit member) {
        if (service.update(member)) {
            // 성공시
            return ResponseEntity.ok(Map.of("message",
                    Map.of("type", "success",
                            "text", "비밀번호 변경 완료했습니다.")));
        } else {
            return ResponseEntity.badRequest()
                    .body(Map.of("message",
                            Map.of("type", "warning",
                                    "text", "입력하신 비밀번호가 맞는지 확인해주세요.")));
        }

    }

}
