import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { TreeView, TreeItem } from "@mui/lab";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const FileNavTree = (props) => {
  const [view, setView] = useState([
    {
      filename: "top1",
      children: [
        {
          filename: "lower1",
          children: [{ filename: "lowest1", children: [] }],
        },
      ],
    },
  ]);

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
    const data = await window.editorfile.readdir(directorypath, true);
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

  // this function calls itself to deal with the the next level of children
  const generateTree = (view, path) => {
    path = props.workingDirectory !== path ? path : "";
    return view.map((next) => {
      if (next !== undefined) {
        return next.isDir ? (
          <TreeItem
            label={next.name}
            key={path + "/" + next.name}
            nodeId={path + "/" + next.name + "/"}
          >
            {next.children.length > 0 &&
              generateTree(next.children, path + "/" + next.name)}
          </TreeItem>
        ) : (
          <TreeItem
            label={next.name}
            key={path + "/" + next.name}
            nodeId={path + "/" + next.name}
          />
        );
      }
    });
  };

  return (
    <Box
      sx={{
        color: "text.primary",
        maxHeight: "100%",
        overflow: "auto",
      }}
      className="sidebar"
      name="filenav"
    >
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
