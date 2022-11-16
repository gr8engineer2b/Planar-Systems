import { Box } from "@mui/material";
import React from "react";
import { Item } from "../Objects/Item";

const DataViewer = () => {
  let obj = new Item("./example.json", { test: ["list"] }, [
    { target: "test", type: "object" },
  ]);
  obj.validate();
  return (
    <Box padding="5vh 2.5vw" width="95%" height="90%">
      {obj.name}
    </Box>
  );
};

export default DataViewer;
