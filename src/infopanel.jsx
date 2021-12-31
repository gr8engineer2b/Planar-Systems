import { Box } from "@mui/system";
import React from "react";
import FileNavTree from "./filenavtree.jsx";

const InfoPanel = (props) => {
  return (
    <Box
      sx={{
        height: "100%",
      }}
    >
      <FileNavTree
        newTabHandler={props.newTabHandler}
        refreshPeriod={2} // int - in seconds
      />
    </Box>
  );
};

export default InfoPanel;
