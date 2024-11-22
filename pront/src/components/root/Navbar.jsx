import { useNavigate } from "react-router-dom";
import { Box, Flex } from "@chakra-ui/react";
import { useContext } from "react";
import { AuthenticationContext } from "../context/AuthenticationProvider.jsx";

function NavbarItem({ children, ...rest }) {
  return (
    <Box
      css={{
        paddingX: "15px",
        paddingY: "10px",
      }}
      _hover={{
        bgColor: "cyan.500",
        cursor: "pointer",
      }}
      {...rest}
    >
      {children}
    </Box>
  );
}

export function Navbar() {
  const navigate = useNavigate();
  //step2 : context 사용하기!
  const { id, isAdmin, isAuthenticated, logout } = useContext(
    AuthenticationContext,
  );
  //  && or 는 true 만나면 바로 true 리턴 ,      ||and 는  falsy 를 만나자 마자 그걸 리턴하고 , 둘다 트루면 마지막
  return (
    <Flex gap={3}>
      <NavbarItem onClick={() => navigate("/")}> home</NavbarItem>
      {isAuthenticated && (
        <NavbarItem onClick={() => navigate("/add")}> 글 작성</NavbarItem>
      )}
      <Box mx={"auto"}></Box>
      {isAuthenticated || (
        <NavbarItem onClick={() => navigate("/member/signup")}>
          {" "}
          회원 가입
        </NavbarItem>
      )}
      {isAdmin && (
        <NavbarItem onClick={() => navigate("/member/list")}>
          회원 목록
        </NavbarItem>
      )}
      {isAuthenticated || (
        <NavbarItem onClick={() => navigate("/member/login")}>
          로그인
        </NavbarItem>
      )}

      {isAuthenticated && (
        <NavbarItem
          onClick={() => {
            logout();
            navigate("/member/login");
          }}
        >
          로그아웃
        </NavbarItem>
      )}
      <NavbarItem onClick={() => navigate(`/member/${id}`)}>{id}</NavbarItem>
    </Flex>
  );
}

export default Navbar;
