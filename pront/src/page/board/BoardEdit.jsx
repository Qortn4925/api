import { useNavigate, useParams } from "react-router-dom";
import { Box, Input, Spinner, Stack, Textarea } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Field } from "../../components/ui/field.jsx";
import { Button } from "../../components/ui/button.jsx";
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
import { toaster } from "../../components/ui/toaster.jsx";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";

export function BoardEdit() {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const navigate = useNavigate();
  const [progress, setProgress] = useState(false);
  const [open, setOpen] = useState(false);
  const { hasAccess } = useContext(AuthenticationContext);

  useEffect(() => {
    axios.get(`/api/board/view/${id}`).then((res) => setBoard(res.data));
  }, []);

  const handleSave = () => {
    setProgress(true);
    axios
      .put(`/api/board/update`, board)
      .then((res) => {
        const data = res.data;
        toaster.create({
          type: data.message.type,
          description: data.message.text,
        });
      })
      .then(() => navigate("/"));
  };
  if (board === null) {
    return <Spinner />;
  }
  const disabled = !(
    board.title.trim().length > 0 && board.content.trim().length > 0
  );

  return (
    <Box>
      <h3>{id}번 게시물 수정 화면</h3>
      <Stack gap={5}>
        <Field label={"제목"}>
          <Input
            value={board.title}
            onChange={(e) => setBoard({ ...board, title: e.target.value })}
          />
        </Field>
        <Field label={"본문"}>
          <Textarea
            value={board.content}
            onChange={(e) => setBoard({ ...board, content: e.target.value })}
          />
        </Field>
        {hasAccess(board.writer) && (
          <Box>
            <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
              <DialogTrigger asChild>
                <Button
                  disabled={disabled}
                  colorPalette={"cyan"}
                  variant={"outline"}
                >
                  저장
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>저장 확인</DialogTitle>
                </DialogHeader>
                <DialogBody>
                  <p>{board.id}번 게시물을 수정하시겠습니까?</p>
                </DialogBody>
                <DialogFooter>
                  <DialogActionTrigger>
                    <Button variant={"outline"}>취소</Button>
                  </DialogActionTrigger>
                  <Button
                    loading={progress}
                    colorPalette={"blue"}
                    onClick={handleSave}
                  >
                    저장
                  </Button>
                </DialogFooter>
              </DialogContent>
            </DialogRoot>
          </Box>
        )}
      </Stack>
    </Box>
  );
}
