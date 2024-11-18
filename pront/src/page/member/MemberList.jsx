import { Box, Spinner, Table } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";

export function MemberList() {
  const [memberlist, setMemberlist] = useState([]);
  useEffect(() => {
    // 회원 목록 요청
    axios.get("/api/member/list").then((res) => setMemberlist(res.data));
  }, []);

  if (!memberlist || memberlist.length === 0) {
    return <Spinner />;
  }
  return (
    <Box>
      <h3> 회원 목록</h3>

      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>ID</Table.ColumnHeader>
            <Table.ColumnHeader>가입 일시</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {memberlist.map((member) => (
            <Table.Row key={member.id}>
              <Table.Cell>{member.id}</Table.Cell>
              <Table.Cell>{member.inserted}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}
