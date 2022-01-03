import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import AppTabs from "./apptabs.jsx";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { blue, deepPurple } from "@mui/material/colors";
import { Box, Button, Dialog, DialogContent, Skeleton } from "@mui/material";

import { BaseObject } from "./Objects/BaseObject";

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
    chooseDir();
  }, []);

  const chooseDir = async () => {
    if (!hasWorkingDirectory) {
      const res = await window.workspace.choose();
      console.log(res);
      setHasWorkingDirectory(res);

      let obj = new BaseObject("./example.json");
      obj.saveFile()
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
        {hasWorkingDirectory ? (
          <AppTabs />
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
    </ThemeProvider>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
