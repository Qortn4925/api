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
  const [progress, setProgress] = useState(false);
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  console.log(files);
  // 글 작성 에서 >  저장 버튼 클릭시
  // spring에서  api/board/add에서 > 보드를 추가하고
  // 리턴 받는 코드였는데
  //  메세지를 추가하고 싶어서  map을 이용하고 , mapper의 결과가 1 즉 성공일때
  // map을 반환해 , 메세지와, boardList를 반환, 그걸 토스터에 출력하고
  // 작성한 게시글로 옮김
  const handleSaveClick = () => {
    setProgress(true);

    //  json 은 텍스트 형식이라 ,  파일 보내고 받기 적합 x
    //   post.form 사용해야함 > 그래서 백엔드에서 받는 방식도 바뀌어야함
    axios
      .postForm("/api/board/add", {
        //   객체로 보낼 속성명과 ,  넘겨줄 변수명이 같으면 생략 가능
        title,
        content: content,
        files: files,
      })
      .then((res) => res.data)
      .then((data) => {
        const message = data.message;

        toaster.create({
          description: message.text,
          type: message.type,
        });
        navigate(`/view/${data.data.id}`);
      })

      .catch((e) => {
        const message = e.response.data.message;
        toaster.create({
          description: message.text,
          type: message.type,
        });
      })
      .finally(() => {
        setProgress(false);
      });
  };
  //  빈 제목이나 본문을 작성할 수 없게
  const disabled = !(title.trim().length > 0 && content.trim().length > 0);
  // files  의 파일명을  component 리스트로 만들기
  const filesList = [];
  for (const file of files) {
    filesList.push(
      <li>
        {file.name} ({Math.floor(file.size / 1024)} kb)
      </li>,
    );
  }
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
        <Box>
          <input
            type={"file"}
            accept={"image/*"}
            multiple
            onChange={(e) => setFiles(e.target.files)}
          />
        </Box>
        <Box>{filesList}</Box>

        <Box>
          <Button
            disabled={disabled}
            loading={progress}
            onClick={handleSaveClick}
          >
            저장
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
