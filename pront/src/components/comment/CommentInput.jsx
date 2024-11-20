import { Box, Group, Textarea } from "@chakra-ui/react";
import { Button } from "../ui/button.jsx";
import { useState } from "react";

export function CommentInput({ boardId, onSaveClick }) {
  const [comment, setComment] = useState("");

  return (
    <Box>
      <Group>
        <Textarea
          onChange={(e) => {
            setComment(e.target.value);
          }}
        />
        <Button onClick={() => onSaveClick(comment)}>작성</Button>
      </Group>
    </Box>
  );
}
