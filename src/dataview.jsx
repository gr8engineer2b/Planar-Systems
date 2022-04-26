import { Box } from "@mui/material";
import React from "react";
import { Item } from "./Objects/Item";

const DataView = () => {
  let obj = new Item("./example.json", { test: ["list"] }, [
    { target: "test", type: "object" },
  ]);
  obj.validate();
  return (
    <Box padding="3% 5%" width="90%" height="90%">
      {obj.name}
    </Box>
  );
};

export default DataView;
