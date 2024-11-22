import { useNavigate } from "react-router-dom";
import { Box, Flex, HStack, Icon, Text } from "@chakra-ui/react";
import React, { useContext } from "react";
import { AuthenticationContext } from "../context/AuthenticationProvider.jsx";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { IoPerson, IoPersonAdd } from "react-icons/io5";
import { FaHome } from "react-icons/fa";
import { PiUsersThreeFill } from "react-icons/pi";

function NavbarItem({ children, ...rest }) {
  return (
    <Box
      css={{
        paddingX: "15px",
        paddingY: "10px",
      }}
      _hover={{
        bgColor: "green.500",
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
      <NavbarItem onClick={() => navigate("/")}>
        <Icon hideFrom={"sm"}>
          <FaHome />
        </Icon>
        <Text hideBelow={"sm"}> home</Text>
      </NavbarItem>
      {isAuthenticated && (
        <NavbarItem onClick={() => navigate("/add")}>
          <Icon hideFrom={"sm"}>
            <HiOutlinePencilSquare />
          </Icon>
          <Text hideBelow={"sm"}> 작성</Text>
        </NavbarItem>
      )}
      <Box mx={"auto"}></Box>
      {isAuthenticated || (
        <NavbarItem onClick={() => navigate("/member/signup")}>
          <Icon hideFrom={"sm"}>
            <IoPersonAdd />
          </Icon>
          <Text hideBelow={"sm"}> 회원 가입</Text>
        </NavbarItem>
      )}
      {isAdmin && (
        <NavbarItem onClick={() => navigate("/member/list")}>
          <Icon hideFrom={"sm"}>
            <PiUsersThreeFill />
          </Icon>
          <Text hideBelow={"sm"}> 회원 목록</Text>
        </NavbarItem>
      )}
      {isAuthenticated || (
        <NavbarItem onClick={() => navigate("/member/login")}>
          <Icon hideFrom={"sm"}>
            <HiOutlinePencilSquare />
          </Icon>
          <Text hideBelow={"sm"}> 로그인 </Text>
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
      {isAuthenticated && (
        <NavbarItem onClick={() => navigate(`/member/${id}`)}>
          <HStack>
            <Icon>
              <IoPerson />
            </Icon>
            <Text> {id} </Text>
          </HStack>
        </NavbarItem>
      )}
    </Flex>
  );
}

export default Navbar;
