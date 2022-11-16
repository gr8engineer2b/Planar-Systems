import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { blue, deepPurple } from "@mui/material/colors";
import CssBaseline from "@mui/material/CssBaseline";
import SettingsService from "./services/SettingsService.js";
import { Box, Button, Dialog, DialogContent, Skeleton } from "@mui/material";

import Router from "./components/router.jsx";

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
  const [skeletonLines, setSkeletonLines] = useState();
  const [spacing, setSpacing] = useState();

  useEffect(() => {
    genSkeletonLines();
    window.addEventListener("resize", () => genSkeletonLines());
    loadSettings();
  }, []);

  const genSkeletonLines = () => {
    let rows = skeletonLines;
    if (window.innerHeight) {
      rows = [];
      const num = (window.innerHeight * 0.6) / 27 - 1;
      for (let x = 0; x < num; x++) {
        rows.push(<Skeleton key={x} />);
      }
      setSkeletonLines(rows);
      setSpacing(
        window.innerHeight * 0.85 -
          (Math.ceil(num) * 27 + 1) -
          window.innerHeight * 0.08
      );
    }
  };

  const loadSettings = async () => {
    await SettingsService.loadSettings();
    if (SettingsService.settings.hasOwnProperty("workspace")) {
      window.workspace.set(SettingsService.settings.workspace);
      setHasWorkingDirectory(true);
    }
  };

  const chooseDir = async () => {
    const res = await window.workspace.choose();
    setHasWorkingDirectory(res[0]);
    SettingsService.settings.workspace = res[1];
    SettingsService.saveSettings();
  };

  return (
    <ThemeProvider theme={myTheme}>
      <Box height="100%" bgcolor="background.default" color="text.primary">
        <Box height="100%">
          {hasWorkingDirectory ? (
            <>
              <CssBaseline />
              <Router />
            </>
          ) : (
            <Box height="100%" padding="2vh 2vw">
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
                  borderRadius: 1,
                  marginBottom: "2vh",
                }}
              />
              <Skeleton
                variant="rectangular"
                sx={{
                  width: "25vw",
                  minWidth: "180px",
                  float: "right",
                  height: "calc(100% - 7vh)",
                  margin: "0 0 2vh 0",
                  borderRadius: 1,
                }}
              />
              <div style={{ height: "2.5vh" }} display="block"></div>
              <div style={{ padding: "2vh 2vw 2vh 0", display: "flow-root" }}>
                {skeletonLines}
                <div style={{ height: "2.5vh" }}></div>
                <Skeleton
                  variant="rectangular"
                  height={spacing}
                  sx={{ borderRadius: 1 }}
                />
              </div>
            </Box>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

const rootcontainer = document.getElementById("root");

const rootdom = ReactDOM.createRoot(rootcontainer);

rootdom.render(<App />);
