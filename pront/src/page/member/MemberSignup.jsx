import { Box, Group, Input, Stack } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { Button } from "../../components/ui/button.jsx";
import { useState } from "react";
import axios from "axios";
import { toaster } from "../../components/ui/toaster.jsx";
import { useNavigate } from "react-router-dom";

export function MemberSignup() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [idCheck, setIdCheck] = useState(false);
  const [passwordCheck, setPasswordCheck] = useState("");
  const navigate = useNavigate();

  function handleSaveClick() {
    axios
      .post("/api/member/signup", { id, email, password, description })
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
      .get("/api/member/checkid", {
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

  // 가입 버튼 비활성화 여부
  let disabled = true;

  if (idCheck) {
    if (password === passwordCheck) {
      disabled = false;
    }
  }

  return (
    <Box>
      <h3> 회원가입</h3>
      <Stack gap={5}>
        <Group attached w={"100%"}>
          <Input value={id} onChange={(e) => setId(e.target.value)} />
          <Button onClick={handleIdCheckClick} variant={"outline"}>
            중복확인
          </Button>
        </Group>

        <Group attached w={"100%"}>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button onClick={handleIdCheckClick} variant={"outline"}>
            중복확인
          </Button>
        </Group>

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
