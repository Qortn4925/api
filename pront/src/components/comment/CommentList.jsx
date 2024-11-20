import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { CommentItem } from "./CommentItem.jsx";

export function CommentList({ boardId }) {
  const [commentList, setCommentList] = useState([]);
  useEffect(() => {
    //요청해서 > comment list 받아오기
    // boardid 는 > 그거뭐냐 , 프롭 드롤리응로 받을 예정
    axios
      .get(`/api/comment/list/${boardId}`)
      .then((res) => res.data)
      .then((data) => setCommentList(data));
  }, []);

  return (
    <Box>
      {commentList.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </Box>
  );
}
