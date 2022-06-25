import React, { useState } from "react";
import { Box, Stack, Button } from "@mui/material";
import { red, orange, pink, deepOrange } from "@mui/material/colors";

const Folder = (props) => {
  return (
    <Button
      onClick={() => setViewData("Campaigns")}
      sx={sty(pink[700])}
    ></Button>
  );
};

const ObjectView = (props) => {
  return <>{props.folder}</>;
};

const ObjectMenu = () => {
  const [ViewData, setViewData] = useState();

  const sty = (color) => {
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
      {ViewData ? (
        <ObjectView folder={ViewData} />
      ) : (
        <Stack spacing={3} padding="5vh 2.5vw" width="95%" height="90%">
          <Stack spacing={3} direction="row" height="25%">
            <Button
              onClick={() => setViewData("Campaigns")}
              sx={sty(pink[700])}
            >
              Campaigns
            </Button>
            <Button
              onClick={() => setViewData("Geography")}
              sx={sty(pink[700])}
            >
              Geography
            </Button>
            <Button onClick={() => setViewData("Sessions")} sx={sty(pink[700])}>
              Sessions
            </Button>
            <Button
              onClick={() => setViewData("Characters")}
              sx={sty(pink[700])}
            >
              Characters
            </Button>
          </Stack>
          <Stack spacing={3} direction="row" height="25%">
            <Button onClick={() => setViewData("Planes")} sx={sty(red[700])}>
              Planes
            </Button>
            <Button onClick={() => setViewData("Gods")} sx={sty(red[700])}>
              Gods
            </Button>
            <Button onClick={() => setViewData("Lore")} sx={sty(red[700])}>
              Lore
            </Button>
            <Button onClick={() => setViewData("Books")} sx={sty(red[700])}>
              Books
            </Button>
          </Stack>
          <Stack spacing={3} direction="row" height="25%">
            <Button
              onClick={() => setViewData("Spells")}
              sx={sty(deepOrange[700])}
            >
              Spells
            </Button>
            <Button
              onClick={() => setViewData("Items")}
              sx={sty(deepOrange[700])}
            >
              Items
            </Button>
            <Button
              onClick={() => setViewData("Monsters")}
              sx={sty(deepOrange[700])}
            >
              Monsters
            </Button>
            <Button
              onClick={() => setViewData("Tables")}
              sx={sty(deepOrange[700])}
            >
              Tables
            </Button>
          </Stack>
          <Stack spacing={3} direction="row" height="25%">
            <Button onClick={() => setViewData("Races")} sx={sty(orange[700])}>
              Races
            </Button>
            <Button
              onClick={() => setViewData("Classes")}
              sx={sty(orange[700])}
            >
              Classes
            </Button>
            <Button onClick={() => setViewData("Feats")} sx={sty(orange[700])}>
              Feats
            </Button>
            <Button
              onClick={() => setViewData("Backgrounds")}
              sx={sty(orange[700])}
            >
              Backgrounds
            </Button>
          </Stack>
        </Stack>
      )}
    </Box>
  );
};

export default ObjectMenu;
