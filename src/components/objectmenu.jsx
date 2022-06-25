import React from "react";
import { Box, Stack, Button } from "@mui/material";
import { deepOrange, red, lightBlue, green } from "@mui/material/colors";

const ObjectMenu = () => {
  const genStyle = (color) => {
    return {
      backgroundColor: color,
      textAlign: "center",
      height: "100%",
      width: "100%",
      color: "text.primary",
      fontSize: "1.8em",
      textTransform: "capitalize",
      overflow: "hidden",
    };
  };
  return (
    <Box height="100%">
      <Stack spacing={3} padding="4vh 2.5vw" width="95%" height="90%">
        <Stack spacing={3} direction="row" height="25%">
          <Button sx={genStyle(deepOrange[700])}>Geography</Button>
          <Button sx={genStyle(deepOrange[700])}>Campaign Builder</Button>
          <Button sx={genStyle(deepOrange[700])}>Session Builder</Button>
          <Button sx={genStyle(deepOrange[700])}>Character Builder</Button>
        </Stack>
        <Stack spacing={3} direction="row" height="25%">
          <Button sx={genStyle(red[700])}>Classes</Button>
          <Button sx={genStyle(red[700])}>Races</Button>
          <Button sx={genStyle(red[700])}>Backgrounds</Button>
          <Button sx={genStyle(red[700])}>Feats</Button>
        </Stack>
        <Stack spacing={3} direction="row" height="25%">
          <Button sx={genStyle(lightBlue[700])}>Gods</Button>
          <Button sx={genStyle(lightBlue[700])}>Planes</Button>
          <Button sx={genStyle(lightBlue[700])}>Books</Button>
          <Button sx={genStyle(lightBlue[700])}>Lore</Button>
        </Stack>
        <Stack spacing={3} direction="row" height="25%">
          <Button sx={genStyle(green[700])}>Tables</Button>
          <Button sx={genStyle(green[700])}>Items</Button>
          <Button sx={genStyle(green[700])}>Spells</Button>
          <Button sx={genStyle(green[700])}>Monsters</Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ObjectMenu;
