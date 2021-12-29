import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Menu,
} from "@mui/material";
import { TreeView, TreeItem } from "@mui/lab";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const FileMenu = (props) => {
  return <Menu></Menu>;
};

const FileNavTree = (props) => {
  const [view, setView] = useState([
    {
      filename: "broken",
      children: [
        {
          filename: "file",
          children: [{ filename: "nav", children: [] }],
        },
      ],
    },
  ]);
  const [overwritePrompt, setOverwritePrompt] = useState(false);
  const [fileState, setFileState] = useState({});

  useEffect(() => {
    getFileStructureData(props.workingDirectory).then((data) => {
      setView(data);
    });
  }, []);

  useEffect(() => {
    const seconds = props.refreshPeriod;
    const timer = setTimeout(() => {
      getFileStructureData(props.workingDirectory).then((data) => {
        setView(data);
      });
    }, seconds * 1000);
    return () => clearTimeout(timer);
  }, [view]);

  const getFileStructureData = async (directorypath) => {
    const data = await window.fs.readDir(directorypath, true);
    if (data) {
      let filelist = [];
      const promiseStack = data.map((item) => {
        if (item) {
          return getFileStructureData(directorypath + "/" + item.name)
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

  const handleRename = async (source, target, overwrite) => {
    overwrite = overwrite ? overwrite : false;
    // check for making sure not to run operations that ultimately don't do anything
    if (source !== target) {
      window.fs.rename(props.workingDirectory, source, target, overwrite);
    }
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
      console.log("dropped", source, "onto", target);
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
      console.log(source, "becomes", target);
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
    path = props.workingDirectory !== path ? path : "";

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
            label={next.name}
            nodeId={path + "/" + next.name + "/"}
          >
            {next.children.length > 0 &&
              generateTree(next.children, path + "/" + next.name)}
          </TreeItem>
        ) : (
          <TreeItem
            key={path + "/" + next.name}
            id={path + "/" + next.name}
            ref={ref}
            draggable={true}
            onDragStart={handleDrag}
            onDragOver={allowDrop}
            onDrop={handleDrop}
            label={next.name}
            nodeId={path + "/" + next.name}
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
              props.newTabHandler(
                undefined,
                nodeIds.slice(0, nodeIds.lastIndexOf("/") + 1),
                nodeIds.slice(nodeIds.lastIndexOf("/") + 1, nodeIds.length)
              );
            }
          }
        }}
      >
        {generateTree(view, props.workingDirectory)}
      </TreeView>
      <br />
    </Box>
  );
};

export default FileNavTree;
