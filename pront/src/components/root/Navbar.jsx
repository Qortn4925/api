import { useNavigate } from "react-router-dom";
import { Box, Flex } from "@chakra-ui/react";
import { useContext } from "react";
import { AuthenticationContext } from "../context/AuthenticationProvider.jsx";

export function Navbar() {
  const navigate = useNavigate();
  //step2 : context 사용하기!
  const { id, isAdmin, isAuthenticated, logout } = useContext(
    AuthenticationContext,
  );
  //  && or 는 true 만나면 바로 true 리턴 ,      ||and 는  falsy 를 만나자 마자 그걸 리턴하고 , 둘다 트루면 마지막
  console.log(isAuthenticated);
  return (
    <Flex gap={3}>
      <Box onClick={() => navigate("/")}> home</Box>
      {isAuthenticated && <Box onClick={() => navigate("/add")}> 글 작성</Box>}
      {isAuthenticated || (
        <Box onClick={() => navigate("/member/signup")}> 회원 가입</Box>
      )}
      {isAdmin && <Box onClick={() => navigate("/member/list")}>회원 목록</Box>}
      {isAuthenticated || (
        <Box onClick={() => navigate("/member/login")}>로그인</Box>
      )}

      {isAuthenticated && (
        <Box
          onClick={() => {
            logout();
            navigate("/member/login");
          }}
        >
          로그아웃
        </Box>
      )}
      <Box onClick={() => navigate(`/member/${id}`)}>{id}</Box>
    </Flex>
  );
}

export default Navbar;
