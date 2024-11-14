import { useState } from "react";
import axios from "axios";
import { Box, Input, Stack, Textarea } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { Button } from "../../components/ui/button.jsx";
import { useNavigate } from "react-router-dom";
import { toaster } from "../../components/ui/toaster.jsx";

export function BoardAdd() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [writer, setWriter] = useState("");

  const navigate = useNavigate();

  // 글 작성 에서 >  저장 버튼 클릭시
  // spring에서  api/board/add에서 > 보드를 추가하고
  // 리턴 받는 코드였는데
  //  메세지를 추가하고 싶어서  map을 이용하고 , mapper의 결과가 1 즉 성공일때
  // map을 반환해 , 메세지와, boardList를 반환, 그걸 토스터에 출력하고
  // 작성한 게시글로 옮김
  const handleSaveClick = () => {
    axios
      .post("/api/board/add", {
        //   객체로 보낼 속성명과 ,  넘겨줄 변수명이 같으면 생략 가능
        title,
        content: content,
        writer: writer,
      })
      .then((res) => res.data)
      .then((data) => {
        const message = data.message;

        toaster.create({
          description: message.text,
          type: message.type,
        });
        navigate(`/view/${data.data.id}`);
      });
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
