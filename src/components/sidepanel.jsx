import { Box } from "@mui/material";
import React from "react";
import NavTree from "./navtree.jsx";

const InfoPanel = (props) => {
  return (
    <Box
      sx={{
        height: "100%",
      }}
    >
      <NavTree
        newTabHandler={props.newTabHandler}
        refreshPeriod={2} // int - in seconds
      />
    </Box>
  );
};

export default InfoPanel;
