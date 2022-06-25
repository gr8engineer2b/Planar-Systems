import { Button, Box } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
    return(
        <Box height="5vh" bgcolor="background.default" color="text.primary">
            <Button component={Link} to="/" variant="contained">Data Explorer</Button>
            <Button component={Link} to="/editors" variant="contained">Editors</Button>
        </Box>
    );
};

export default NavBar;