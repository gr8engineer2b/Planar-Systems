import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import AppTabs from "./apptabs.jsx";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { blue, deepPurple } from "@mui/material/colors";
import { Box, Button, Dialog, DialogContent, Skeleton } from "@mui/material";

const myTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: deepPurple[400] },
    secondary: { main: blue[700] },
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

  useEffect(() => {
    grabInitial();
  }, []);

  const grabInitial = async () => {
    if (!hasWorkingDirectory) {
      const res = window.workspace.choose();
      setHasWorkingDirectory(res);
    }
  };

  const genSkeletonLines = () => {
    let rows = [];
    const num = window.innerHeight / 45;
    for (let x = 0; x < num; x++) {
      rows.push(<Skeleton key={x} />);
    }
    return rows;
  };

  return (
    <ThemeProvider theme={myTheme}>
      <Box height="100%" bgcolor="background.default" color="text.primary">
        {hasWorkingDirectory ? (
          <AppTabs />
        ) : (
          <Box height="100%">
            <Dialog open={true} height="20vh">
              <DialogContent sx={{ padding: "2em", backgroundColor: "#111" }}>
                <Button
                  color="error"
                  variant="outlined"
                  onClick={() => grabDir()}
                >
                  Select Directory to Continue
                </Button>
              </DialogContent>
            </Dialog>
            <div style={{ padding: "0.5em 0 0 0" }}>
              <Skeleton
                variant="rectangular"
                sx={{
                  height: "2em",
                  borderRadius: 1,
                  margin: "1em",
                }}
              />
            </div>
            <div
              style={{
                width: "25vw",
                minWidth: "180px",
                float: "right",
                height: "calc(100% - 2em)",
                padding: "0 1em 1em 0",
              }}
            >
              <Skeleton
                variant="rectangular"
                sx={{
                  height: "calc(90vh  - 1em)",
                  borderRadius: 1,
                }}
              />
            </div>
            <div style={{ padding: "1em", display: "flow-root" }}>
              {genSkeletonLines()}
              <br />
              <Skeleton
                variant="rectangular"
                sx={{
                  height: "20vh",
                  borderRadius: 1,
                }}
              />
            </div>
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
