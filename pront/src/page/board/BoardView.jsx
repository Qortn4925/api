import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Image,
  Input,
  Spinner,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Field } from "../../components/ui/field.jsx";
import { toaster } from "../../components/ui/toaster.jsx";
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
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import { CommentContainer } from "../../components/comment/CommentContainer.jsx";

function ImageFileView({ files }) {
  return (
    <>
      {files.map((file) => (
        <Image
          key={files}
          src={file}
          w={"100%"}
          border={"1px solid black"}
          m={3}
        />
      ))}
    </>
  );
}

export function BoardView() {
  // 쿼리스트링에 붙은  id를 가져오는거  , 백엔드에서는  리퀘파람에붙은
  // ID 값을 기준으로 >  board를 받아 오겠지 .
  // 그걸 응답 본문에 받아서   넘겨줄건데
  // axios.get("/api/board/)  여기서 하는게 아니라 , 같이 넘겨줘야 되는거 아닌가 ?
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const navigate = useNavigate();
  const { hasAccess } = useContext(AuthenticationContext);
  useEffect(() => {
    axios.get(`/api/board/view/${id}`).then((res) => {
      setBoard(res.data);
    });
  }, []);
  if (board === null) {
    return <Spinner />;
  }

  const handleDeleteClick = () => {
    axios
      .delete(`/api/board/delete/${board.id}`)
      .then((res) => res.data)
      .then((data) => {
        toaster.create({
          type: data.message.type,
          description: data.message.text,
        });
        navigate("/");
      })
      .catch((e) => {
        const data = e.response.data;
        toaster.create({
          type: data.message.type,
          description: data.message.text,
        });
      });
  };
  return (
    <Box>
      <h3> {board.id} 게시글 </h3>
      <Stack gap={5}>
        <Field label={"제목"}>
          <Input value={board.title} />
        </Field>
        <Field label={"본문"}>
          <Textarea value={board.content} />
        </Field>
        <ImageFileView files={board.fileSrc} />
        <Field label={"작성자"}>
          <Input value={board.writer} />
        </Field>
        <Field label={"작성일시"}>
          <Input value={board.inserted} />
        </Field>
        {hasAccess(board.writer) && (
          <Box>
            <DialogRoot>
              <DialogTrigger asChild>
                <Button bg={"red.700"} variant={"outline"}>
                  {" "}
                  삭제
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle> 삭제 확인</DialogTitle>
                </DialogHeader>
                <DialogBody>
                  <p>{board.id}번 게시물을 삭제하시겠습니까</p>
                </DialogBody>
                <DialogFooter>
                  <DialogActionTrigger>
                    <Button variant={"outline"}>취소</Button>
                  </DialogActionTrigger>

                  <Button bg={"red.700"} onClick={handleDeleteClick}>
                    삭제
                  </Button>
                </DialogFooter>
              </DialogContent>
            </DialogRoot>
            <Box>
              <Button onClick={() => navigate(`/edit/${board.id}`)} bg={"cyan"}>
                수정
              </Button>
            </Box>
          </Box>
        )}
      </Stack>

      <hr />
      <CommentContainer boardId={board.id} />
    </Box>
  );
}
