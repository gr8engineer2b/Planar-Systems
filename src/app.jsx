import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import ObjectMenu from "./objectmenu.jsx";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { blue, deepPurple } from "@mui/material/colors";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Skeleton,
  Stack,
} from "@mui/material";
import DataView from "./dataview.jsx";

const myTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: deepPurple[400] },
    secondary: { main: blue[700] },
  },
  typography: {
    fontFamily: `"Varela Round", sans-serif;`,
  },
  shape: { borderRadius: 10 },
  components: {
    MuiTreeItem: {
      styleOverrides: {
        content: {
          padding: 0,
        },
      },
    },
  },
});

const App = () => {
  const [hasWorkingDirectory, setHasWorkingDirectory] = useState(false);
  const [devDataOpen, setDevDataOpen] = useState(false);
  const [skeletonLines, setSkeletonLines] = useState();

  useEffect(() => {
    chooseDir();
    genSkeletonLines();
    window.addEventListener("resize", () => genSkeletonLines());
  }, []);

  const chooseDir = async () => {
    if (!hasWorkingDirectory) {
      const res = await window.workspace.choose();
      setHasWorkingDirectory(res);
    }
  };

  const genSkeletonLines = () => {
    let rows = skeletonLines;
    if (window.innerHeight) {
      rows = [];
      const num = (window.innerHeight * 0.63) / 24 - 1;
      for (let x = 0; x < num; x++) {
        rows.push(<Skeleton key={x} />);
      }
      setSkeletonLines(rows);
    }
  };

  return (
    <ThemeProvider theme={myTheme}>
      <Box height="100%" bgcolor="background.default" color="text.primary">
        <Button
          onClick={() => {
            setDevDataOpen(!devDataOpen);
          }}
          sx={{ position: "fixed" }}
        >
          {!devDataOpen ? "Open" : "Close"} Dev Data View
        </Button>
        {devDataOpen ? (
          <DataView />
        ) : (
          <Box height="100%">
            {hasWorkingDirectory ? (
              <ObjectMenu />
            ) : (
              <Box height="100%" padding="1vh 1vw">
                <Dialog open={true} height="20vh">
                  <DialogContent sx={{ padding: 0, backgroundColor: "#111" }}>
                    <Button
                      color="error"
                      variant="contained"
                      onClick={() => chooseDir()}
                    >
                      Select Directory to Continue
                    </Button>
                  </DialogContent>
                </Dialog>
                <Skeleton
                  component="div"
                  variant="rectangular"
                  sx={{
                    height: "5vh",
                    marginBottom: "2vh",
                    borderRadius: 1,
                  }}
                />
                <Skeleton
                  variant="rectangular"
                  sx={{
                    width: "25vw",
                    minWidth: "180px",
                    float: "right",
                    height: "90vh",
                    marginLeft: "1vw",
                    borderRadius: 1,
                  }}
                />
                <Stack sx={{ marginTop: "5vh" }}>
                  {skeletonLines}
                  <Skeleton
                    variant="rectangular"
                    sx={{
                      height: "20vh",
                      marginTop: "4vh",
                      borderRadius: 1,
                    }}
                  />
                </Stack>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
};

const Nav = () => {
  return (
    <ThemeProvider theme={myTheme}>
      <Button>ARGH HELP ME</Button>
    </ThemeProvider>
  );
};

const rootcontainer = document.getElementById("root");
const navcontainer = document.getElementById("navbar");

const rootdom = ReactDOM.createRoot(rootcontainer);
const navdom = ReactDOM.createRoot(navcontainer);

rootdom.render(<App />);
navdom.render(<Nav />);
