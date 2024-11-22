import { Box, Group, Input, Stack } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { Button } from "../../components/ui/button.jsx";
import { useState } from "react";
import axios from "axios";
import { toaster } from "../../components/ui/toaster.jsx";
import { useNavigate } from "react-router-dom";
import { MyHeading } from "../../components/root/MyHeading.jsx";

export function MemberSignup() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [idCheck, setIdCheck] = useState(false);
  const [passwordCheck, setPasswordCheck] = useState("");
  const [emailCheck, setEmailCheck] = useState(false);
  const navigate = useNavigate();

  function handleSaveClick() {
    axios
      .post("/api/member/signup", {
        id,
        //  email 입력 안할시  "" 으로 받아져 > 중복처리 되서   못 하는 문제 막기 위해 아니면 널
        email: email.length === 0 ? null : email,
        password,
        description,
      })
      .then((res) => {
        const message = res.data.message;
        toaster.create({
          type: message.type,
          description: message.text,
        });
        //TODO:login 으로 이동 아직 안 만듬 , +  깃허브 커밋된 마지막꺼 안함
        navigate("/");
      })
      .catch((e) => {
        const message = e.data.message;
        toaster.create({
          type: message.type,
          description: message.text,
        });
      })
      .finally(() => {
        console.log("항상");
      });
  }

  const handleIdCheckClick = () => {
    axios
      .get("/api/member/check", {
        params: {
          id: id,
        },
      })
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        const message = data.message;
        toaster.create({
          type: message.type,
          description: message.text,
        });

        setIdCheck(data.available);
      });
  };

  const handleEmailCheckClick = () => {
    axios
      .get("/api/member/check", {
        params: {
          email: email,
        },
      })
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        const message = data.message;
        toaster.create({
          type: message.type,
          description: message.text,
        });
        setEmailCheck(data.available);
      });
  };

  // 가입 버튼 비활성화 여부
  let disabled = true;

  // 이메인 중복 확인 버튼 활성화 여부

  let emailCheckButtonDisabled = email.length === 0;

  if (idCheck && emailCheck) {
    if (password === passwordCheck) {
      disabled = false;
    }
  }

  return (
    <Box mx={"auto"} w={{ md: "550px" }}>
      <MyHeading> 회원 가입 </MyHeading>
      <Stack gap={5} my={30}>
        <Field label={"아이디"}>
          <Group attached w={"100%"}>
            <Input value={id} onChange={(e) => setId(e.target.value)} />

            <Button onClick={handleIdCheckClick} variant={"outline"}>
              중복확인
            </Button>
          </Group>
        </Field>

        <Field label={"이메일"}>
          <Group attached w={"100%"}>
            <Input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (e.target.value.length > 0) {
                  setEmailCheck(false);
                } else {
                  setEmailCheck(true);
                }
              }}
            />

            <Button
              disabled={emailCheckButtonDisabled}
              onClick={handleEmailCheckClick}
              variant={"outline"}
            >
              중복확인
            </Button>
          </Group>
        </Field>

        <Field label={"비밀번호"}>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <Field label={"비밀번호 체크"}>
          <Input
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
          />
        </Field>

        <Field label={"소개"}>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>
        <Box>
          <Button disabled={disabled} onClick={handleSaveClick}>
            {" "}
            가입{" "}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
