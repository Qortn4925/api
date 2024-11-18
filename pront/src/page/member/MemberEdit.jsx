import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, Group, Input, Spinner, Stack } from "@chakra-ui/react";
import axios from "axios";
import { Field } from "../../components/ui/field.jsx";
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog.jsx";
import { Button } from "../../components/ui/button.jsx";
import { toaster } from "../../components/ui/toaster.jsx";

export function MemberEdit() {
  const { id } = useParams();
  const [member, setMember] = useState();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [description, setDescription] = useState("");
  const [emailCheck, setEmailCheck] = useState(true);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/member/${id}`).then((res) => {
      setMember(res.data);
      setEmail(res.data.email);
      setPassword(res.data.password);
      setDescription(res.data.description);
    });
  }, []);

  function handleSaveClick() {
    axios
      .put("/api/member/update", {
        id: member.id,
        email: email.length === 0 ? null : email,
        password: password,
        oldPassword,
        description,
      })
      .then((res) => {
        console.log(res);
        const message = res.data.message;

        toaster.create({
          type: message.type,
          description: message.text,
        });
        navigate(`/member/${id}`);
      })
      .catch((e) => {
        const message = e.data.message;

        toaster.create({
          type: message.type,
          description: message.text,
        });
      })
      .finally(setOpen(false));
  }

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

  let emailCheckButtonDisabled = true;

  let saveButtonDisabled = false;

  // 체크를 안했으면 >  false ,  체크 했으면 > true
  if (!emailCheck) {
    saveButtonDisabled = true;
  }

  // 이메일을 안쓰거나 기존과 같으면 true, 그렇지 않으면  false
  if (email.length === 0 || member.email === email) {
    // 이메일을 안쓰거나 기존과 같으면 true
  } else {
    emailCheckButtonDisabled = false;
  }

  if (member === null) {
    return <Spinner />;
  }
  return (
    <Box>
      <h3> 회원 정보</h3>

      <Stack gap={5}>
        <Field readOnly label={"아이디"}>
          {" "}
          <Input defaultValue={id} />
        </Field>
        <Field label={"이메일"}>
          {" "}
          <Group>
            <Input
              defaultValue={email}
              onChange={(e) => {
                setEmail(e.target.value);
                const emptyEmail = e.target.value.length === 0;
                // member email 은 수정 전이니까 항상 같은 값을 받아와서 , 언제든 기존 값을 가져올 수 있음
                const sameEmail = e.target.value === member.email;
                if (emptyEmail || sameEmail) {
                  setEmailCheck(true);
                } else {
                  setEmailCheck(false);
                }
              }}
            />
            <Button
              disabled={emailCheckButtonDisabled}
              onClick={handleEmailCheckClick}
            >
              {" "}
              중복 확인
            </Button>
          </Group>
        </Field>
        <Field label={"비밀번호"}>
          {" "}
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <Field label={"자기소개"}>
          {" "}
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>
        <Box>
          <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
            <DialogTrigger asChild>
              {/*  중복 확인 안하면  , 변경 할 수 없도록*/}
              <Button disabled={saveButtonDisabled} colorPalette={"red"}>
                저장
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>기존 암호 정보 확인 </DialogTitle>
              </DialogHeader>
              <DialogBody>
                <Stack gap={5}>
                  <Field label={"암호"}>
                    <Input
                      placeholder={"암호를 입력해주세요."}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                    />
                  </Field>
                </Stack>
              </DialogBody>
              <DialogFooter>
                <DialogActionTrigger>
                  <Button variant={"outline"}>취소</Button>
                </DialogActionTrigger>
                <Button colorPalette={"red"} onClick={handleSaveClick}>
                  저장
                </Button>
              </DialogFooter>
            </DialogContent>
          </DialogRoot>
        </Box>
      </Stack>
    </Box>
  );
}
