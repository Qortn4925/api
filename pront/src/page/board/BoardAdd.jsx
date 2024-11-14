import { useState } from "react";
import axios from "axios";
import { Box, Input, Stack, Textarea } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { Button } from "../../components/ui/button.jsx";
import { useNavigate } from "react-router-dom";

export function BoardAdd() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [writer, setWriter] = useState("");

  const navigate = useNavigate();

  const handleSaveClick = () => {
    axios
      .post("/api/board/add", {
        //   객체로 보낼 속성명과 ,  넘겨줄 변수명이 같으면 생략 가능
        title,
        content: content,
        writer: writer,
      })
      .then((res) => res.data)
      .then((data) => navigate(`view/${data.data.id}`)
        const message = data.message;
      toaster.create({
        description:message.text,

      })
      );
  };
  return (
    <Box>
      <h3> 안녕</h3>
      <Stack gap={5}>
        <Field>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label={"본문"}>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </Field>
        <Field label={"작성자"}>
          <Input value={writer} onChange={(e) => setWriter(e.target.value)} />
        </Field>
        <Box>
          <Button onClick={handleSaveClick}>저장</Button>
        </Box>
      </Stack>
    </Box>
  );
}
