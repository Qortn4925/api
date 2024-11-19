import { useNavigate } from "react-router-dom";
import { Box, Flex } from "@chakra-ui/react";
import { useContext } from "react";
import { AuthenticationContext } from "../context/AuthenticationProvider.jsx";

export function Navbar() {
  const navigate = useNavigate();
  //step2 : context 사용하기!
  const authentication = useContext(AuthenticationContext);

  return (
    <Flex gap={3}>
      <Box onClick={() => navigate("/")}> home</Box>
      {authentication.isAuthenticated && (
        <Box onClick={() => navigate("/add")}> 글 작성</Box>
      )}
      {authentication.isAuthenticated || (
        <Box onClick={() => navigate("/member/signup")}> 회원 가입</Box>
      )}
      {authentication.isAdmin && (
        <Box onClick={() => navigate("/member/list")}>회원 목록</Box>
      )}
      {authentication.isAuthenticated || (
        <Box onClick={() => navigate("/member/login")}>로그인</Box>
      )}

      {authentication.isAuthenticated && (
        <Box
          onClick={() => {
            authentication.logout(); // 토큰 없어짐
            // login 가서는 글 작성 안보여야 하고 , 로그아웃이 아닌 로그인이 보여야 하는거 아니가 ?
            navigate("/member/login");
          }}
        >
          {" "}
          로그 아웃
        </Box>
      )}
      <Box variant={"outline"} bg={"black.300"}>
        {" "}
        {authentication.id}
      </Box>
    </Flex>
  );
}

export default Navbar;
