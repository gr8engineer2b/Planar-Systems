import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import ObjectMenu from "./objectmenu.jsx";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { blue, deepPurple } from "@mui/material/colors";
import { Box, Button, Dialog, DialogContent, Skeleton } from "@mui/material";
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

  useEffect(() => {
    chooseDir();
  }, []);

  const chooseDir = async () => {
    if (!hasWorkingDirectory) {
      const res = await window.workspace.choose();
      setHasWorkingDirectory(res);
    }
  };

  const genSkeletonLines = () => {
    let rows = [];
    const num = (window.innerHeight * 0.7 - 48) / 26;
    for (let x = 0; x < num; x++) {
      rows.push(<Skeleton key={x} />);
    }
    return rows;
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
              <Box height="100%">
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
                <div style={{ padding: "1em" }}>
                  <Skeleton
                    variant="rectangular"
                    sx={{
                      height: "2em",
                      borderRadius: 1,
                    }}
                  />
                </div>
                <div
                  style={{
                    width: "25vw",
                    minWidth: "180px",
                    float: "right",
                    height: "calc(100% - 5em)",
                    padding: "0 1em 1em 0",
                  }}
                >
                  <Skeleton
                    variant="rectangular"
                    sx={{
                      height: "100%",
                      borderRadius: 1,
                    }}
                  />
                </div>
                <br />
                <br />
                <div style={{ padding: "1em", display: "flow-root" }}>
                  {genSkeletonLines()}
                  <br />
                  <Skeleton
                    variant="rectangular"
                    sx={{
                      height: "calc(30vh - 5em)",
                      borderRadius: 1,
                    }}
                  />
                </div>
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
