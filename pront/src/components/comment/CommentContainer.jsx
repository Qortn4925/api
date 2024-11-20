import { Box, Stack } from "@chakra-ui/react";
import { CommentInput } from "./CommentInput.jsx";
import { CommentList } from "./CommentList.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import { toaster } from "../ui/toaster.jsx";

export function CommentContainer({ boardId }) {
  const [commentList, setCommentList] = useState([]);
  const [process, setProcess] = useState(false);

  useEffect(() => {
    //요청해서 > comment list 받아오기
    // boardid 는 > 그거뭐냐 , 프롭 드롤리응로 받을 예정
    axios
      .get(`/api/comment/list/${boardId}`)
      .then((res) => res.data)
      .then((data) => setCommentList(data));
  }, [process]);

  function handleSaveClick(comment) {
    setProcess(true);
    if (!process) {
      axios
        .post("/api/comment/add", {
          boardId: boardId,
          comment: comment,
        })
        .then((res) => {
          res.data.message;
        })
        .then((message) => {
          toaster.create({
            type: type,
            description: text,
          });
        })
        .finally(() => setProcess(false));
    }
  }

  function handleEditClick(id, comment) {
    setProcess(true);
    axios
      .put("/api/comment/edit", {
        id,
        comment,
      })
      .then((res) => res.data)
      .then((data) => {
        const message = data.message;
        toaster.create({
          type: message.type,
          description: message.text,
        });
      })
      .finally(() => {
        setProcess(false);
      });
  }

  // id 는 > 밑에서 사용할거니까 , 함수 원형으로 계속 넘기다가 , 사용할 곳에서  comment,id 받아서 사용
  function handleDeleteClick(id) {
    setProcess(true);
    axios.delete(`/api/comment/remove/${id}`).finally(() => setProcess(false));
  }

  return (
    <Box>
      <Stack gap={5}>
        <h3> 댓글</h3>
        <CommentInput boardId={boardId} onSaveClick={handleSaveClick} />
        <CommentList
          boardId={boardId}
          commentList={commentList}
          onDeleteClick={handleDeleteClick}
          onEditClick={handleEditClick}
        />
      </Stack>
    </Box>
  );
}
