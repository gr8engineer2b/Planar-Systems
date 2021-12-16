import {
  Paper,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableContainer,
  TableCell,
  Typography,
  Box,
  Popover,
  Button,
} from "@mui/material";
import React from "react";

const Character = ({ object }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const clickHandler = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeHandler = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <Paper elevation={5} sx={{ padding: 1 }} className="display-character">
      <Typography className="display-character-title">
        {object.name} "{object.title}", {object.class}
      </Typography>
      {object.stats && (
        <Box className="display-stats">
          <Button color="secondary" variant="contained" onClick={clickHandler}>
            Stats
          </Button>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={closeHandler}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <TableContainer component={Paper}>
              <Table
                size={"small"}
                sx={{ minWidth: 10 }}
                aria-label="stat table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell align={"center"}>STR</TableCell>
                    <TableCell align={"center"}>DEX</TableCell>
                    <TableCell align={"center"}>CON</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell align={"center"}>{object.stats.str}</TableCell>
                    <TableCell align={"center"}>{object.stats.dex}</TableCell>
                    <TableCell align={"center"}>{object.stats.con}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Table
                size={"small"}
                sx={{ minWidth: 10 }}
                aria-label="stat table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell align={"center"}>WIS</TableCell>
                    <TableCell align={"center"}>INT</TableCell>
                    <TableCell align={"center"}>CHA</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell align={"center"}>{object.stats.wis}</TableCell>
                    <TableCell align={"center"}>{object.stats.int}</TableCell>
                    <TableCell align={"center"}>{object.stats.cha}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Popover>
        </Box>
      )}
    </Paper>
  );
};

export default Character;
