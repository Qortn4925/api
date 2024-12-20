import React, { useState } from "react";
import axios from "axios";
import { Box, Card, Input, Stack, Text, Textarea } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { Button } from "../../components/ui/button.jsx";
import { useNavigate } from "react-router-dom";
import { toaster } from "../../components/ui/toaster.jsx";
import { MyHeading } from "../../components/root/MyHeading.jsx";

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
  let sumOfFileSize = 0;
  let invalidOneFileSize = false; // 파일 크기 1mb 넘는지 확인 변수
  for (const file of files) {
    if (file.size > 1024 * 1024) {
      invalidOneFileSize = true;
    }
    sumOfFileSize += file.size;
    filesList.push(
      <Card.Root size={"sm"}>
        <Card.Body>
          <Text
            fontWeight={"bold"}
            truncate
            css={{ color: file.size > 1024 * 1024 ? "red" : "black" }}
          >
            {file.name}({Math.floor(file.size / 1024)} kb)
          </Text>
        </Card.Body>
      </Card.Root>,
    );
  }
  let fileInputInvalid = false;
  // 10mb 넘거나 , 1mbr 넘거나
  if (sumOfFileSize > 10 * 1024 * 1024 || invalidOneFileSize) {
    fileInputInvalid = true;
  }
  return (
    <Box w={{ md: "550px" }} mx={"auto"}>
      <MyHeading> 작성</MyHeading>

      <Stack gap={5} my={"30px"}>
        <Field label={"제목"}>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label={"본문"}>
          <Textarea
            value={content}
            h={200}
            onChange={(e) => setContent(e.target.value)}
          />
        </Field>
        <Box>
          <Field
            label={"파일"}
            helperText={
              " 파일 크기 하나: 1mb, 총 합계 : 10mb 이내로 선택해주세요"
            }
            invalid={fileInputInvalid}
            errorText={"파일의 용량이 초과되었습니다."}
          >
            <input
              type={"file"}
              accept={"image/*"}
              multiple
              onChange={(e) => setFiles(e.target.files)}
            />
          </Field>
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
