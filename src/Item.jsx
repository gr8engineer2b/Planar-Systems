import { Paper, Typography } from "@mui/material";
import React from "react";

const Item = ({ object }) => {
  return (
    <Paper elevation={5} sx={{ padding: 1 }} className="display-item">
      <Typography variant="body1" className="display-item-title">
        {object.name}
      </Typography>
      <Typography variant="body1" className="display-item-description">
        {object.desc}
      </Typography>
    </Paper>
  );
};

export default Item;
