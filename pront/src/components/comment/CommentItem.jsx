import { Box, Flex } from "@chakra-ui/react";

export function CommentItem({ key, comment }) {
  return (
    <Box border={"1px solid black"} m={5}>
      <Flex justify={"space-between"}>
        <h3>작성자: {comment.memberId}</h3>
        <h4>작성시간: {comment.inserted}</h4>
      </Flex>
      <p> 내용:{comment.comment}</p>
    </Box>
  );
}
