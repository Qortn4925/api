import { Badge, Box, Button, HStack, Input, Table } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "../../components/ui/pagination.jsx";
import { FaCommentDots, FaImages } from "react-icons/fa6";
import { GoHeartFill } from "react-icons/go";

export function BoardList() {
  const [boardList, setBoardList] = useState([]);
  const navigate = useNavigate();
  //쿼리  URLSearchParmas 객체 반환
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState({
    // 병합 널이면 > 우항
    type: "all",
    // 병합 연산자
    keyword: "",
  });
  const [count, setCount] = useState(0);

  // param
  useEffect(() => {
    // config 의 params 속성을 이용해 , requset 할때 파람을 붙여서 갈 수 있고
    const controller = new AbortController();

    axios
      .get("/api/board/list", {
        params: searchParams,
        signal: controller.signal,
      })
      .then((res) => res.data)
      .then((d) => {
        setCount(d.count);
        setBoardList(d.list);
      });
    return () => {
      controller.abort();
    };
  }, [searchParams]);

  useEffect(() => {
    const nextSearch = { ...search };

    if (searchParams.get("st")) {
      nextSearch.type = searchParams.get("st");
    } else {
      nextSearch.type = "all";
    }
    if (searchParams.get("sk")) {
      nextSearch.keyword = searchParams.get("sk");
    } else {
      nextSearch.keyword = "";
    }

    setSearch(nextSearch);
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

  function handelSearchClick() {
    console.log(search);
    console.log("버튼실행");
    if (search.keyword.trim().length > 0) {
      // 검색
      const nextSearchParams = new URLSearchParams(searchParams);
      //param에 붙임
      nextSearchParams.set("st", search.type);
      nextSearchParams.set("sk", search.keyword);
      nextSearchParams.set("page", 1);
      setSearchParams(nextSearchParams);
    } else {
      // 검색 안함
      const nextSearchParam = new URLSearchParams(searchParams);
      nextSearchParam.delete("st");
      nextSearchParam.delete("sk");
    }
  }

  return (
    <Box>
      <h3> 게시글 목록</h3>
      {boardList.length > 0 ? (
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>번호</Table.ColumnHeader>
              <Table.ColumnHeader>제목</Table.ColumnHeader>
              <Table.ColumnHeader>
                <GoHeartFill />
              </Table.ColumnHeader>
              <Table.ColumnHeader>작성자</Table.ColumnHeader>
              <Table.ColumnHeader>작성일시</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {boardList.map((board) => (
              // 파라미터가 필요해서 , 함수를 넣어서  파라미터 넣어줌
              <Table.Row
                key={board.id}
                onClick={() => handleRowClick(board.id)}
              >
                <Table.Cell> {board.id}</Table.Cell>
                <Table.Cell>
                  {" "}
                  {board.title}
                  {board.countComment > 0 && (
                    <Badge variant={"solid"} colorPalette={"green"}>
                      <FaCommentDots />:{board.countComment}
                    </Badge>
                  )}
                  {board.countFile > 0 && (
                    <Badge varian={"solid"} colorPalette={"blue"}>
                      <FaImages />:{board.countFile}
                    </Badge>
                  )}
                </Table.Cell>
                <Table.Cell>
                  {board.countLike > 0 ? board.countLike : ""}
                </Table.Cell>
                <Table.Cell> {board.writer}</Table.Cell>
                <Table.Cell> {board.inserted}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      ) : (
        <p> 조회된 결과가 없습니다.</p>
      )}
      <HStack>
        {/*    차크라유아이*/}
        {/*<NativeSelectRoot*/}
        {/*  onChange={(e) => setSearch({ ...search, type: e.target.value })}*/}
        {/*>*/}
        {/*  <NativeSelectField*/}
        {/*    items={[*/}
        {/*      { label: "전체", value: "all" },*/}
        {/*      { label: "제목", value: "title" },*/}
        {/*      { label: "본문", value: "content" },*/}
        {/*    ]}*/}
        {/*  />*/}
        {/*</NativeSelectRoot>*/}
        <Box>
          <select
            value={search.type}
            onChange={(e) => setSearch({ ...search, type: e.target.value })}
          >
            <option value={"all"}>전체</option>
            <option value={"title"}>제목</option>
            <option value={"content"}>본문</option>
          </select>
        </Box>
        <Input
          value={search.keyword}
          onChange={(e) =>
            setSearch({ ...search, keyword: e.target.value.trim() })
          }
        />
        <Button onClick={handelSearchClick}>검색</Button>
      </HStack>
      <PaginationRoot
        onPageChange={handlePageChange}
        count={count}
        pageSize={10}
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
