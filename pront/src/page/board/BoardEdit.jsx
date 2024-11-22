import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  HStack,
  Image,
  Input,
  Spinner,
  Stack,
  Textarea,
} from "@chakra-ui/react";
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
import { Switch } from "../../components/ui/switch.jsx";

function ImageView({ files, onRemoveSwitchClick }) {
  return (
    <Box>
      {files.map((file) => (
        <HStack key={file.name}>
          <Switch
            variant={"solid"}
            onCheckedChange={(e) => {
              onRemoveSwitchClick(e.checked, file.name);
            }}
          />
          <Image src={file.src} border={"1px solid black"} m={3} />
        </HStack>
      ))}
    </Box>
  );
}

export function BoardEdit() {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const navigate = useNavigate();
  const [progress, setProgress] = useState(false);
  const [open, setOpen] = useState(false);
  const { hasAccess } = useContext(AuthenticationContext);
  const [removeFiles, setRemoveFiles] = useState([]);
  const [uploadFiles, setUploadFiles] = useState([]);

  useEffect(() => {
    axios.get(`/api/board/view/${id}`).then((res) => setBoard(res.data));
  }, []);

  const handleRemoveSwitchClick = (checked, fileName) => {
    if (checked) {
      setRemoveFiles([...removeFiles, fileName]);
    } else {
      setRemoveFiles(removeFiles.filter((f) => f !== fileName));
    }
  };

  const handleSave = () => {
    setProgress(true);
    axios
      .putForm(`/api/board/update`, {
        id: board.id,
        title: board.title,
        content: board.content,
        removeFiles,
        uploadFiles,
      })
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
        <ImageView
          files={board.fileSrc}
          onRemoveSwitchClick={handleRemoveSwitchClick}
        />
        <Box>
          <Box>
            <input
              type={"file"}
              accept={"image/*"}
              multiple
              onChange={(e) => {
                console.log(e.target.files);
                setUploadFiles(e.target.files);
              }}
            />
            {Array.from(uploadFiles).map((file) => (
              <li key={file.name}>
                {file.name}(Math.floor{file.size / 1024}kb
              </li>
            ))}
          </Box>
        </Box>
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
