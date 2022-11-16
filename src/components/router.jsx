import { Box } from "@mui/material";
import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import NavBar from "./navbar.jsx";
import TabBar from "./tabbar.jsx";

const Router = ({ hasWorkingDirectory }) => {
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
          <Route
            path="/"
            element={<TabBar hasWorkingDirectory={hasWorkingDirectory} />}
          />
          <Route render={() => <Redirect to="/" />} />
        </Routes>
      </Box>
    </HashRouter>
  );
};

export default Router;
