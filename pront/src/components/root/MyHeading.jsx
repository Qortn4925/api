import { Heading } from "@chakra-ui/react";
import React from "react";

// 자손을 쫙 뿌리고 ,  남은 객체를 프랍에 품
export function MyHeading({ children, ...rest }) {
  return (
    <Heading {...rest} size={{ base: "xl", md: "2xl" }}>
      {" "}
      {children}{" "}
    </Heading>
  );
}
