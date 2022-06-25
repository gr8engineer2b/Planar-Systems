import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Input,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Popover,
} from "@mui/material";
import { TreeView, TreeItem } from "@mui/lab";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DeleteIcon from "@mui/icons-material/Delete";
import NewFileIcon from "@mui/icons-material/NoteAdd";
import FolderIcon from "@mui/icons-material/Folder";
import NewFolderIcon from "@mui/icons-material/CreateNewFolder";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";

const FileMenu = (props) => {
  return (
    <Menu
      open={props.menuOpen}
      anchorEl={props.anchorEl}
      onClose={props.handleMenuClose}
    >
      <MenuList dense>
        <MenuItem onClick={(e) => props.handleMenuClose(e, "Open")}>
          <ListItemIcon>
            <FileOpenIcon />
          </ListItemIcon>
          <ListItemText>Open</ListItemText>
        </MenuItem>
        <MenuItem onClick={(e) => props.handleMenuClose(e, "Rename")}>
          <ListItemIcon>
            <DriveFileRenameOutlineIcon />
          </ListItemIcon>
          <ListItemText>Rename</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={(e) => props.handleMenuClose(e, "File")}>
          <ListItemIcon>
            <NewFileIcon />
          </ListItemIcon>
          <ListItemText>New File</ListItemText>
        </MenuItem>
        <MenuItem onClick={(e) => props.handleMenuClose(e, "Folder")}>
          <ListItemIcon>
            <NewFolderIcon />
          </ListItemIcon>
          <ListItemText>New Folder</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={(e) => props.handleMenuClose(e, "Delete")}>
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

const FileNavTree = (props) => {
  const [overwritePrompt, setOverwritePrompt] = useState(false);
  const [fileState, setFileState] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(document.getElementById("root"));
  const [renameFile, setRenameFile] = useState({
    current: null,
    newName: null,
  });
  const [view, setView] = useState([
    {
      name: "broken",
      children: [
        {
          name: "file",
          children: [{ name: "nav", children: [] }],
        },
      ],
    },
  ]);

  useEffect(() => {
    getFileStructureData().then((data) => {
      setView(data);
    });
  }, []);

  useEffect(() => {
    const seconds = props.refreshPeriod;
    const timer = setTimeout(() => {
      getFileStructureData().then((data) => {
        setView(data);
      });
    }, seconds * 1000);
    return () => clearTimeout(timer);
  }, [view, renameFile, anchorEl]);

  const getFileStructureData = async (localpath) => {
    localpath = localpath ? localpath : "";
    const data = await window.fs.readDir(localpath);
    if (data) {
      let filelist = [];
      const promiseStack = data.map((item) => {
        if (item) {
          return getFileStructureData(localpath + "/" + item.name)
            .then((itemchildren) => {
              item.children = itemchildren;
            })
            .then(filelist.push(item));
        }
      });
      await Promise.all(promiseStack);
      return filelist;
    }
  };

  const handleRename = (source, target, overwrite) => {
    // check for making sure not to run operations that ultimately don't do anything
    target = target.slice(0, target.slice(-1) === "/" ? -1 : target.length);
    source = source.slice(0, source.slice(-1) === "/" ? -1 : source.length);
    if (source !== target) {
      window.fs.rename(source, target, overwrite);
    }
    setRenameFile({ current: null, newName: null });
    setAnchorEl(null);
  };

  const handleDrag = (e) => {
    e.stopPropagation(); //this prevents multiple trigers and is pretty uneccessary
    e.dataTransfer.setData("text", e.target.id);
  };

  const handleDrop = (e) => {
    e.stopPropagation(); //this prevents higher directories taking the file
    let source = e.dataTransfer.getData("text");
    let target = e.target.parentNode.parentNode.id;
    let newpath = "";
    let exists = false;
    // primary check for making sure not to run operations that ultimately don't do anything (dropping on self)
    if (source !== target) {
      target = target.slice(0, target.lastIndexOf("/") + 1);
      if (source.slice(source.lastIndexOf("/") + 1, source.length) !== "") {
        target =
          (target === "" ? "/" : target) +
          source.slice(source.lastIndexOf("/") + 1, source.length);
        exists = document.getElementById(target);
      } else {
        newpath = target.slice(0, target.lastIndexOf("/"));
        source = source.slice(
          0,
          source.length - 1 === source.lastIndexOf("/")
            ? source.length - 1
            : source.length
        );
        target =
          newpath +
          "/" +
          source.slice(source.lastIndexOf("/") + 1, source.length);
        exists = document.getElementById(target + "/");
      }
      if (source !== target) {
        if (exists) {
          setFileState({ source: source, target: target });
          setOverwritePrompt(true);
        } else {
          handleRename(source, target);
        }
      }
    }
  };

  const allowDrop = (e) => {
    e.preventDefault();
  };

  // this function calls itself to deal with the the next level of children
  const generateTree = (view, path) => {
    path = path ? path : "";

    // This is a temporary measure IMO until it breaks something else :)
    const ref = (elt) => {
      elt?.addEventListener("focusin", (e) => {
        // Disable Treeview focus system which make draggable on TreeIten unusable
        // see https://github.com/mui-org/material-ui/issues/29518
        e.stopImmediatePropagation();
      });
    };

    return view.map((next) => {
      if (next !== undefined) {
        return next.isDir && next.children ? (
          <TreeItem
            key={path + "/" + next.name + "/"}
            id={path + "/" + next.name + "/"}
            ref={ref}
            draggable={true}
            onDragStart={handleDrag}
            onDragOver={allowDrop}
            onDrop={handleDrop}
            disabled={renameFile.current === path + "/" + next.name + "/"}
            label={
              <>
                <Popover
                  anchorEl={anchorEl}
                  open={renameFile.current === path + "/" + next.name + "/"}
                  onClose={() =>
                    setRenameFile({ current: null, newName: null })
                  }
                  sx={{ margin: "0 0 0 15px" }}
                >
                  <Input
                    autoFocus
                    defaultValue={next.name}
                    size="small"
                    sx={{
                      padding: "0 0 0 8px",
                      input: {
                        padding: 0,
                      },
                      "&::after": {
                        display: "none",
                      },
                      "&::before": {
                        display: "none",
                      },
                    }}
                    onFocus={() => {
                      setAnchorEl(document.getElementById(renameFile.current));
                    }}
                    onChange={(e) =>
                      setRenameFile((x) => {
                        return { current: x.current, newName: e.target.value };
                      })
                    }
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && renameFile.newName !== null) {
                        handleRename(
                          path + "/" + next.name,
                          path + "/" + renameFile.newName
                        );
                      }
                    }}
                  />
                </Popover>

                {next.name}
                <FolderIcon
                  sx={{ paddingLeft: "4px", position: "absolute" }}
                  fontSize="small"
                />
              </>
            }
            nodeId={path + "/" + next.name + "/"}
            onContextMenu={handleMenuOpen}
          >
            {next.children.length > 0 &&
              generateTree(next.children, path + "/" + next.name)}
          </TreeItem>
        ) : (
          <TreeItem
            variant="standard"
            key={path + "/" + next.name}
            id={path + "/" + next.name}
            ref={ref}
            draggable={true}
            onDragStart={handleDrag}
            onDragOver={allowDrop}
            onDrop={handleDrop}
            disabled={renameFile.current === path + "/" + next.name}
            label={
              <>
                <Popover
                  anchorEl={anchorEl}
                  open={renameFile.current === path + "/" + next.name}
                  onClose={() =>
                    setRenameFile({ current: null, newName: null })
                  }
                  sx={{ margin: "0 0 0 15px" }}
                >
                  <Input
                    autoFocus
                    defaultValue={next.name}
                    size="small"
                    sx={{
                      padding: "0 0 0 8px",
                      input: {
                        padding: 0,
                      },
                      "&::after": {
                        display: "none",
                      },
                      "&::before": {
                        display: "none",
                      },
                    }}
                    onFocus={() => {
                      setAnchorEl(document.getElementById(renameFile.current));
                    }}
                    onChange={(e) =>
                      setRenameFile((x) => {
                        return { current: x.current, newName: e.target.value };
                      })
                    }
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleRename(
                          path + "/" + next.name,
                          path + "/" + renameFile.newName
                        );
                      }
                    }}
                  />
                </Popover>
                {next.name}
              </>
            }
            nodeId={path + "/" + next.name}
            onContextMenu={handleMenuOpen}
          />
        );
      }
    });
  };

  const promptCloseHandler = (overwrite) => {
    if (overwrite) {
      handleRename(fileState.source, fileState.target, overwrite);
    }
    setFileState({});
    setOverwritePrompt(false);
  };

  const handleMenuOpen = (event) => {
    event.stopPropagation(); //this prevents higher directories taking the click
    setMenuOpen(true);
    setAnchorEl(event.currentTarget.firstChild);
  };

  const handleMenuClose = (e, op) => {
    const target = anchorEl.parentElement;
    let filepath = target.id.slice(
      0,
      target.id.lastIndexOf("/") + (target.id.slice(-1) === "/" ? 1 : 0)
    );
    switch (op) {
      case "Open":
        if (target.id.slice(-1) !== "/") {
          props.newTabHandler(null, target.id);
        }
        break;
      case "Rename":
        setRenameFile({ current: target.id, newName: target.id });
        break;
      case "File":
        filepath = filepath + "New_File";
        window.fs.writeFile(filepath, "");
        setRenameFile({
          current: filepath,
          newName: filepath,
        });
        break;
      case "Folder":
        filepath = filepath + "New_Folder";
        console.log(filepath);
        window.fs.createDir(filepath);
        setRenameFile({
          current: filepath + "/",
          newName: filepath + "/",
        });
        break;
      case "Delete":
        if (target.id.slice(-1) === "/") {
          // ToDo directory removal with confirmation
        } else {
          window.fs.removeFile(target.id);
        }
        break;
    }
    setMenuOpen(false);
  };

  // There is potential for adding the file/folder creation prompt to the top level/empty space but I see no real necessesity for this
  return (
    <Box
      sx={{
        color: "text.primary",
        height: "100%",
        overflow: "auto",
      }}
      className="sidebar"
      name="filenav"
      onDragOver={allowDrop}
      onDrop={handleDrop}
      id={"/"}
    >
      <FileMenu
        menuOpen={menuOpen}
        anchorEl={anchorEl}
        handleMenuClose={handleMenuClose}
      />
      <Dialog open={overwritePrompt} onClose={() => promptCloseHandler(false)}>
        <DialogTitle>Overwrite Existing File?</DialogTitle>
        <DialogContent>
          This file already exists, are you sure you want to overwrite?
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={() => promptCloseHandler(false)}>
            Stop
          </Button>
          <Button color="error" onClick={() => promptCloseHandler(true)}>
            Overwrite
          </Button>
        </DialogActions>
      </Dialog>
      <br />
      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        onNodeSelect={(event, nodeIds) => {
          if (typeof nodeIds === "string") {
            if (nodeIds[nodeIds.length - 1] !== "/") {
              props.newTabHandler(null, nodeIds);
            }
          }
        }}
      >
        {generateTree(view)}
      </TreeView>
      <br />
    </Box>
  );
};

export default FileNavTree;
