import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { blue, deepPurple } from "@mui/material/colors";
import CssBaseline from "@mui/material/CssBaseline";

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
  return (
    <ThemeProvider theme={myTheme}>
      <CssBaseline />
      <Router />
    </ThemeProvider>
  );
};

const rootcontainer = document.getElementById("root");

const rootdom = ReactDOM.createRoot(rootcontainer);

rootdom.render(<App />);
