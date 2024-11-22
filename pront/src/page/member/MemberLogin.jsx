import { Box, Button, HStack, Input, Stack } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toaster } from "../../components/ui/toaster.jsx";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import { MyHeading } from "../../components/root/MyHeading.jsx";

export function MemberLogin() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const authentication = useContext(AuthenticationContext);

  function handleLoginClick() {
    axios
      .post("/api/member/login", { id, password })
      .then((res) => res.data)
      .then((data) => {
        //토스트 띄우고
        toaster.create({
          type: data.message.type,
          description: data.message.text,
        });
        // 이동
        navigate("/");
        // local Storage에 token 저장
        authentication.login(data.token);
      })
      .catch((e) => {
        const message = e.response.data.message;
        // 토스트 띄우고
        toaster.create({
          type: message.type,
          description: message.text,
        });
      })
      .finally();
  }

  return (
    <Box mx={"auto"} w={{ md: "550px" }}>
      <MyHeading> 로그인 </MyHeading>
      <Stack my={30}>
        <Field label={"아이디"}>
          {" "}
          <Input value={id} onChange={(e) => setId(e.target.value)} />
        </Field>

        <Field label={"암호"} my={15}>
          {" "}
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <HStack gap={5}>
          <Box>
            <Button onClick={handleLoginClick}> 로그인</Button>
          </Box>
          <Box>
            <Button
              onClick={() => {
                navigate("/member/signup");
              }}
            >
              {" "}
              회원가입
            </Button>
          </Box>
        </HStack>
      </Stack>
    </Box>
  );
}
