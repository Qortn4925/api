import { Box, Flex, HStack, Textarea } from "@chakra-ui/react";
import { Button } from "../ui/button.jsx";
import React, { useContext, useState } from "react";
import { AuthenticationContext } from "../context/AuthenticationProvider.jsx";
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog.jsx";
import * as PropTypes from "prop-types";

function DeleteButton({ onClick }) {
  const [open, setOpen] = useState(false);

  return (
    <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
      <DialogTrigger asChild>
        <Button colorPalette={"red"} variant={"outline"}>
          삭제
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>삭제 확인</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p>댓글을 삭제 하시겠습니까?</p>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger>
            <Button variant={"outline"}>취소</Button>
          </DialogActionTrigger>
          <Button colorPalette={"blue"} onClick={onClick}>
            삭제
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}

function EditButton({ comment, onEditClick }) {
  const [open, setOpen] = useState();
  const [newComment, setNewComment] = useState(comment.comment);

  //수정 요청을 보내면 ,  controller 에서 , 수정을하고 , 다시 받아와야 하는데,
  //  rerender 된 값을 보여줘야 한단 말이지 ,

  return (
    <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
      <DialogTrigger asChild>
        <Button variant={"outline"}>수정</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>수정 확인</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger>
            <Button variant={"outline"}>취소</Button>
          </DialogActionTrigger>
          <Button
            colorPalette={"blue"}
            onClick={() => {
              setOpen(false);
              onEditClick(comment.id, newComment);
            }}
          >
            수정
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}

EditButton.propTypes = { colorPalette: PropTypes.string };

export function CommentItem({ comment, onDeleteClick, onEditClick }) {
  const { hasAccess } = useContext(AuthenticationContext);
  console.log(hasAccess());
  return (
    <Flex border={"1px solid black"} p={2.5} direction={"column"}>
      <Box>
        <h5 css={{ paddingY: "5px" }}> {comment.memberId}</h5>
      </Box>

      <HStack h={"80%"}>
        {/*<h4>작성시간: {comment.inserted}</h4>*/}

        {/* 댓글 줄 바꿈 하는 경우가 많은데 ,
         html은 공백을 안 먹어서 ,  pre 태그 사용 하거나 ,
         chakra 에서도 사용하고 싶으면 ,  css 속성으로 whiteSpace:pre 로*/}
        <Box w={"80%"}>
          <p style={{ whiteSpace: "pre" }}> 내용 {comment.comment}</p>
        </Box>

        {!hasAccess() && (
          <HStack>
            <EditButton comment={comment} onEditClick={onEditClick} />
            <DeleteButton
              onClick={() => {
                onDeleteClick(comment.id);
              }}
            />
          </HStack>
        )}
      </HStack>
    </Flex>
  );
}
