import { Box, Group, Textarea } from "@chakra-ui/react";
import { Button } from "../ui/button.jsx";
import { useContext, useState } from "react";
import { AuthenticationContext } from "../context/AuthenticationProvider.jsx";

export function CommentInput({ boardId, onSaveClick }) {
  const [comment, setComment] = useState("");
  const { isAuthenticated } = useContext(AuthenticationContext);
  return (
    <Box>
      <Group>
        <Textarea
          value={comment}
          disabled={!isAuthenticated}
          placeholder={isAuthenticated ? "" : "로그인 후 댓글을 남겨주세요"}
          onChange={(e) => {
            setComment(e.target.value);
          }}
        />
        <Button
          disabled={!isAuthenticated}
          onClick={() => {
            setComment("");
            onSaveClick(comment);
          }}
        >
          작성
        </Button>
      </Group>
    </Box>
  );
}
