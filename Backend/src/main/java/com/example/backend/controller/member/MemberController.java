package com.example.backend.controller.member;

import com.example.backend.dto.member.Member;
import com.example.backend.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/member")
@RequiredArgsConstructor
public class MemberController {
    final MemberService service;

    @PostMapping("signup")
    public ResponseEntity<Map<String, Object>> signup(@RequestBody Member member) {


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

    @GetMapping("checkid")
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

    @GetMapping("list")
    public List<Member> list() {
        return service.list();
    }
}
