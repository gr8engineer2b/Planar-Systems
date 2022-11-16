import { Paper, Typography } from "@mui/material";
import React from "react";

const Item = ({ item }) => {
  return item ? (
    <Paper elevation={5} sx={{ padding: 1 }} className="display-item">
      <Typography variant="body1" className="display-item-title">
        {item.name ? item.name : ""}
      </Typography>
      <Typography variant="body1" className="display-item-description">
        {item.desc ? item.desc : ""}
      </Typography>
    </Paper>
  ) : (
    <></>
  );
};

export default Item;
