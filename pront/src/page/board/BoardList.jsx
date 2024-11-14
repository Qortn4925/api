import { Box, Table } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function BoardList() {
  const [boardList, setBoardList] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get("/api/board/list")
      .then((res) => res.data)
      .then((d) => setBoardList(d));
  }, []);

  function handleRowClick(id) {
    // react-router
    navigate(`/view/${id}`);
  }

  return (
    <Box>
      <h3> 게시글 목록</h3>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>번호</Table.ColumnHeader>
            <Table.ColumnHeader>제목</Table.ColumnHeader>
            <Table.ColumnHeader>작성자</Table.ColumnHeader>
            <Table.ColumnHeader>작성일시</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {boardList.map((board) => (
            // 파라미터가 필요해서 , 함수를 넣어서  파라미터 넣어줌
            <Table.Row key={board.id} onClick={() => handleRowClick(board.id)}>
              <Table.Cell> {board.id}</Table.Cell>
              <Table.Cell> {board.title}</Table.Cell>
              <Table.Cell> {board.writer}</Table.Cell>
              <Table.Cell> {board.inserted}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}
