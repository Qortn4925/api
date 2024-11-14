import { useState } from "react";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import { Box, Flex, Input, Stack, Textarea } from "@chakra-ui/react";
import { Field } from "./components/ui/field.jsx";
import { Button } from "./components/ui/button.jsx";
import axios from "axios";

function Navbar() {
  const navigate = useNavigate();
  return (
    <Flex gap={3}>
      <Box onClick={() => navigate("/")}> home</Box>
      <Box onClick={() => navigate("/add")}> 글 작성</Box>
    </Flex>
  );
}

function RootLayout() {
  return (
    <Stack>
      <Box>
        <Navbar />
      </Box>
      <Box>
        <Outlet />
      </Box>
    </Stack>
  );
}

function BoardList() {
  return (
    <Box>
      <h3> 게시글 목록</h3>
    </Box>
  );
}

function BoardAdd() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [writer, setWriter] = useState("");

  const handleSaveClick = () => {
    axios.post("/api/board/add", {
      //   객체로 보낼 속성명과 ,  넘겨줄 변수명이 같으면 생략 가능
      title,
      content: content,
      writer: writer,
    });
  };
  return (
    <Box>
      <h3> 안녕</h3>
      <Stack gap={5}>
        <Field>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label={"본문"}>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </Field>
        <Field label={"작성자"}>
          <Input value={writer} onChange={(e) => setWriter(e.target.value)} />
        </Field>
        <Box>
          <Button onClick={handleSaveClick}>저장</Button>
        </Box>
      </Stack>
    </Box>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <BoardList />,
      },
      {
        path: "add",
        element: <BoardAdd />,
      },
    ],
  },
]);

function App() {
  const [count, setCount] = useState(0);

  return <RouterProvider router={router} />;
}

export default App;
