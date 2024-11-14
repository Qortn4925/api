import { useState } from "react";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import { Box, Flex, Stack } from "@chakra-ui/react";

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
  return (
    <Box>
      <h3> 안녕</h3>
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
        index: "add",
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
