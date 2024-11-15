package com.example.backend.controller.member;

import com.example.backend.dto.member.Member;
import com.example.backend.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
