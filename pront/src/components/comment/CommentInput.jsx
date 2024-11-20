import { Box, Group, Textarea } from "@chakra-ui/react";
import { Button } from "../ui/button.jsx";

export function CommentInput({ boardId, onSaveClick }) {
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
