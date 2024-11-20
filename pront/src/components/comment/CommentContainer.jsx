import { Box, Stack } from "@chakra-ui/react";
import { CommentInput } from "./CommentInput.jsx";
import { CommentList } from "./CommentList.jsx";
import { useEffect, useState } from "react";
import axios from "axios";

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
        .finally(() => setProcess(false));
    }
  }

  return (
    <Box>
      <Stack gap={5}>
        <h3> 댓글</h3>
        <CommentInput boardId={boardId} onSaveClick={handleSaveClick} />
        <CommentList boardId={boardId} commentList={commentList} />
      </Stack>
    </Box>
  );
}
