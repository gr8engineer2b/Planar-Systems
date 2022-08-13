import { Button, Box } from "@mui/material";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import SettingsService from "../services/SettingsService";
import DataExplorer from "./dataexplorer.jsx";

const loadSettings = async () => {
  await SettingsService.loadSettings();
};

const NavBar = () => {
  useEffect(() => {
    loadSettings();
    console.log(SettingsService);
  }, []);

  return (
    <Box height="5vh" bgcolor="background.default" color="text.primary">
      <Button
        component={Link}
        to="/"
        onClick={() => {
          SettingsService.settings.workspace = undefined;
          SettingsService.saveSettings();
          if (window.location.hash == "#/") {
            window.history.go(0);
          }
        }}
        variant="contained"
        render={<DataExplorer uuid={crypto.randomUUID()} />}
      >
        Reset Directory
      </Button>
      <Button
        component={Link}
        to="/"
        variant="contained"
        onClick={() => {
          if (window.location.hash == "#/") {
            window.history.go(0);
          }
        }}
      >
        Data Explorer
      </Button>
      <Button component={Link} to="/editors" variant="contained">
        Editors
      </Button>
    </Box>
  );
};

export default NavBar;
