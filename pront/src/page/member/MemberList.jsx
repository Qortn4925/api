import { Box, Spinner, Table } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MyHeading } from "../../components/root/MyHeading.jsx";

export function MemberList() {
  const [memberlist, setMemberlist] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    // 회원 목록 요청
    axios.get("/api/member/list").then((res) => setMemberlist(res.data));
  }, []);

  if (!memberlist || memberlist.length === 0) {
    return <Spinner />;
  }

  function handleRowClick(id) {
    navigate(`/member/${id}`);
  }

  return (
    <Box>
      <MyHeading> 회원 목록</MyHeading>

      <Table.Root m={"30px"}>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>ID</Table.ColumnHeader>
            <Table.ColumnHeader>이메일</Table.ColumnHeader>
            <Table.ColumnHeader>가입 일시</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {memberlist.map((member) => (
            <Table.Row
              onClick={() => handleRowClick(member.id)}
              key={member.id}
            >
              <Table.Cell>{member.id}</Table.Cell>
              <Table.Cell>{member.email}</Table.Cell>

              <Table.Cell>{member.inserted}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}
