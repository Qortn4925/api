import { Box, Flex, HStack } from "@chakra-ui/react";
import { Button } from "../ui/button.jsx";

export function CommentItem({ comment, onDeleteClick }) {
  return (
    <HStack border={"1px solid black"} m={5}>
      <Box w={"80%"}>
        <Flex justify={"space-between"}>
          <h3>작성자: {comment.memberId}</h3>
          <h4>작성시간: {comment.inserted}</h4>
        </Flex>
        <p> 내용:{comment.comment}</p>
      </Box>
      <Box w={"20%"}>
        <Button colorPalette={"purple"}> 수정</Button>
        <Button
          colorPalette={"red"}
          onClick={() => {
            const id = comment.id;
            onDeleteClick(id);
          }}
        >
          {" "}
          삭제
        </Button>
      </Box>
    </HStack>
  );
}
