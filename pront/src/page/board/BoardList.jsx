import { Box, HStack, Table } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "../../components/ui/pagination.jsx";

export function BoardList() {
  const [boardList, setBoardList] = useState([]);
  const navigate = useNavigate();
  //쿼리  URLSearchParmas 객체 반환
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    // config 의 params 속성을 이용해 , requset 할때 파람을 붙여서 갈 수 있고
    const controller = new AbortController();
    axios
      .get("/api/board/list", {
        params: searchParams,
        signal: controller.signal,
      })
      .then((res) => res.data)
      .then((d) => setBoardList(d));
    return () => {
      controller.abort();
    };
  }, [searchParams]);

  function handleRowClick(id) {
    // react-router  > get 방식으로
    // 해당 버튼의  id를 클릭시  id값을 파라미터에 넘겨주면서
    navigate(`/view/${id}`);
  }

  const pageParam = searchParams.get("page") ? searchParams.get("page") : "1";
  const page = Number(pageParam);

  function handlePageChange(e) {
    console.log(e.page);
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("page", e.page);
    setSearchParams(nextSearchParams);
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
      <PaginationRoot
        onPageChange={handlePageChange}
        count={1500}
        pageSize={10}
        defaultPage={1}
        page={page}
      >
        <HStack>
          <PaginationPrevTrigger />
          <PaginationItems />
          <PaginationNextTrigger />
        </HStack>
      </PaginationRoot>
    </Box>
  );
}
