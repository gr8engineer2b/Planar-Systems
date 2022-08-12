import { Box } from "@mui/material";
import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import DataExplorer from "./dataexplorer.jsx";
import AppTabs from "./apptabs.jsx";
import NavBar from "./navbar.jsx";

const Router = () => {
  return (
    <HashRouter>
      <Box
        component="div"
        sx={{
          height: "95vh",
        }}
      >
        <NavBar />
        <Routes>
          <Route path="/" element={<DataExplorer />} />
          <Route path="/editors" element={<AppTabs />} />
          <Route render={() => <Redirect to="/" />} />
        </Routes>
      </Box>
    </HashRouter>
  );
};

export default Router;
