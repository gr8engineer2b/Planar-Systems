import React from "react";
import ReactDOM from "react-dom";
import EditorTabs from "./editortabs.jsx";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const myTheme = createTheme({});

ReactDOM.render(
  <ThemeProvider theme={myTheme}>
    <EditorTabs />
  </ThemeProvider>,
  document.getElementById("root")
);
