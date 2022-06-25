import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import TextEditor from "./texteditor.jsx";
import InfoPanel from "./infopanel.jsx";
import { Tabs, Tab, Box, IconButton, Button, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { v4 as uuidv4 } from "uuid";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      style={{ height: "calc(100% - 57px - 16px - 50px)" }}
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2, paddingTop: 0, height: "100%" }}>{children}</Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}

const AppTabs = (props) => {
  const [value, setValue] = useState(99999);
  const [tabEditorStates, setTabEditorStates] = useState({});
  const [tabs, setTabs] = useState([]);

  useEffect(() => {
    if (tabs.length === 0) {
      newTabHandler();
    }
  }, []);

  const editorChangeHandler = (editorState, uuid) => {
    setTabEditorStates((items) => {
      items[uuid] = editorState;
      return items;
    });
  };

  const changeTabHandler = (event, newValue) => {
    setValue(newValue);
  };

  const newTabHandler = (event, filepath) => {
    const newindex = tabs.length;
    const uuid = uuidv4();

    addTab(newindex, uuid, filepath);
  };

  const addTab = (index, uuid, filepath) => {
    if (filepath !== undefined) {
      const match = tabs.filter((x) => {
        return x.filepath === filepath;
      });
      if (match.length === 0) {
        setTabs([
          ...tabs,
          {
            filepath: filepath,
            index: index,
            uuid: uuid,
          },
        ]);
        setValue(index);
      } else {
        setValue(tabs.findIndex((tab) => tab === match[0]));
      }
    } else {
      setTabs([
        ...tabs,
        {
          filepath: "",
          index: index,
          uuid: uuid,
        },
      ]);
      setValue(index);
    }
    setTabEditorStates((states) => {
      states[uuid] = null;
      return states;
    });
  };

  const removeTab = (index) => {
    let newTabs = [];
    let newIndex = index;
    if (index !== undefined) {
      newTabs = tabs.filter((tab) => {
        return tab.index !== index;
      });
      if (newTabs.length === 0) {
        newIndex = 99999; // the last tab
        // can keep an empty editor tab active if desired
        newTabs = [
          // {
          //   filepath: "",
          //   index: 0,
          //   uuid: uuidv4(),
          // },
        ];
      } else {
        // this is a reindex step, :) it just works
        var inc = 1;
        newTabs = newTabs.map((tab) => ({
          filepath: tab.filepath,
          index: inc++ - 1,
          uuid: tab.uuid,
        }));
        // keeps the user on the working tab
        newIndex = index <= value ? (value === 0 ? 0 : value - 1) : value;
      }
      setTabs(newTabs);

      setValue(newIndex);
      // ToDo: handle state removeal from tabeditorstates
    }
  };

  const nameFileHandler = (uuid, filepath) => {
    const tabmatch = tabs.filter((tab) => {
      return tab.uuid === uuid;
    });
    const antitabmatch = tabs.filter((tab) => {
      return tab.uuid !== uuid;
    });
    if (tabmatch.length > 0) {
      setTabs([
        ...antitabmatch,
        {
          filepath: filepath,
          index: tabmatch[0].index,
          uuid: tabmatch[0].uuid,
        },
      ]);
    }
  };

  const parseFilepath = (filepath, trunclen) => {
    const path = filepath.slice(0, filepath.lastIndexOf("/"));
    let filename = filepath.slice(
      filepath.lastIndexOf("/") + 1,
      filepath.length
    );
    if (trunclen === undefined) trunclen = 10;
    const extention = filename.slice(
      ((filename.lastIndexOf(".") - 1) >>> 0) + 2
    );
    filename = filename.slice(0, -extention.length - 1);
    const trunc =
      filename.length > trunclen
        ? filename.slice(0, trunclen - 2) + ".."
        : filename;
    return [path, trunc, extention, filename];
  };

  return (
    <Box sx={{ height: "100%" }}>
      <div
        style={{
          width: "25vw",
          minWidth: "180px",
          float: "right",
          height: "100%",
          borderLeft: "1px solid #222",
        }}
      >
        <InfoPanel newTabHandler={newTabHandler} />
      </div>
      <div
        style={{
          minWidth: "300px",
          width: "auto",
          overflow: "hidden",
          height: "100%",
        }}
      >
        <Box
          sx={{
            padding: 1,
            color: "text.primary",
            paddingTop: 0,
          }}
        >
          <Tabs
            variant="scrollable"
            scrollButtons="auto"
            value={value}
            onChange={changeTabHandler}
            sx={{ borderBottom: "1px solid #222" }}
          >
            {tabs.map(({ filepath, index, uuid }) => (
              <Tab
                component="div"
                className="tabstyle"
                key={filepath !== "" ? filepath : "empty-" + uuid}
                label={
                  <span>
                    {filepath !== "" ? (
                      <Tooltip title={parseFilepath(filepath)[0]}>
                        <span>
                          <div style={{ display: "inline-flex" }}>
                            {parseFilepath(filepath)[1]}
                          </div>
                          <div style={{ display: "inline-flex" }}>
                            .{parseFilepath(filepath)[2]}
                          </div>
                        </span>
                      </Tooltip>
                    ) : (
                      "New File"
                    )}
                    <IconButton
                      key={"remove-" + index}
                      onClick={(event) => {
                        event.stopPropagation();
                        removeTab(index);
                      }}
                      sx={{
                        display: "inline-flex",
                        marginBottom: "2px",
                        marginLeft: "4px",
                        height: "1em",
                        width: "1em",
                      }}
                      color="error"
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </span>
                }
                {...a11yProps(index)}
              />
            ))}
            {/* ToDo: figure out a way for the add icon to either appear above the right scroll or not be covered when making a new file */}
            <Tab
              component="div"
              className="tabstyle lasttab"
              key="lastTab"
              value={99999}
              label={
                <IconButton
                  key={"new-tab"}
                  onClick={(event) => {
                    event.stopPropagation();
                    newTabHandler();
                  }}
                  sx={{
                    height: "100%",
                    width: "100%",
                    borderRadius: 0,
                  }}
                  color="success"
                >
                  <AddIcon fontSize="normal" />
                </IconButton>
              }
            />
          </Tabs>
        </Box>
        {tabs.map(({ index, filepath, uuid }) => (
          <TabPanel key={uuid} value={value} index={index}>
            <TextEditor
              filepath={filepath}
              uuid={uuid}
              editorChangeHandler={editorChangeHandler}
              editorState={tabEditorStates[uuid]}
              nameFileHandler={nameFileHandler}
            />
          </TabPanel>
        ))}
        <TabPanel key={"lastTabPanel"} value={value} index={99999}>
          <Button
            key={"new-tab-alt"}
            onClick={(event) => {
              event.stopPropagation();
              newTabHandler();
            }}
            color="success"
            variant="outlined"
          >
            Create New Tab
          </Button>
        </TabPanel>
      </div>
    </Box>
  );
};

export default AppTabs;
