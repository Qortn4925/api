import { useParams } from "react-router-dom";
import { Box } from "@chakra-ui/react";

export function BoardEdit() {
  const { id } = useParams();
  return (
    <Box>
      <h3>{id}번 게시물 수정 화면</h3>
    </Box>
  );
}
