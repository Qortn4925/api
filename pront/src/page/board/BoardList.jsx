import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";

export function BoardList() {
  const [boardList, setBoardList] = useState([]);
  useEffect(() => {
    axios
      .get("/api/board/list")
      .then((res) => res.data)
      .then((d) => setBoardList(d));
  }, []);
  return (
    <Box>
      <h3> 게시글 목록</h3>
      <ul>
        {boardList.map((board) => (
          <li>
            {board.title} , {board.writer}
          </li>
        ))}
        {/*  게시물 들을 테이블로 */}
      </ul>
    </Box>
  );
}
