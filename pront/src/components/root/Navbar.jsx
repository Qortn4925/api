import { useNavigate } from "react-router-dom";
import { Box, Flex } from "@chakra-ui/react";

export function Navbar() {
  const navigate = useNavigate();
  return (
    <Flex gap={3}>
      <Box onClick={() => navigate("/")}> home</Box>
      <Box onClick={() => navigate("/add")}> 글 작성</Box>
      <Box onClick={() => navigate("/member/signup")}> 회원 가입</Box>
      <Box onClick={() => navigate("/member/list")}>회원 목록</Box>
      <Box onClick={() => navigate("/member/login")}>로그인</Box>
    </Flex>
  );
}

export default Navbar;
