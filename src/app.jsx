import React from "react";
import ReactDOM from "react-dom";
import EditorTabs from "./editortabs.jsx";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { blue, deepPurple } from "@mui/material/colors";

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


const workingDirectory = "C:/Users/eldar/AppData/Roaming/planar-systems/Test";
(async () => {
  await window.editorfile.createDir(workingDirectory);
})()
// const workingDirectory = "C:/Users/gr8en/Appdata/Roaming/planar-systems/Test";

ReactDOM.render(
  <ThemeProvider theme={myTheme}>
    <EditorTabs workingDirectory={workingDirectory} />
  </ThemeProvider>,
  document.getElementById("root")
);
