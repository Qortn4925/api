import { Heading } from "@chakra-ui/react";
import React from "react";

export function MyHeading({ children, ...rest }) {
  return (
    <Heading {...rest} size={{ base: "xl", md: "2xl" }}>
      {" "}
      {children}{" "}
    </Heading>
  );
}
