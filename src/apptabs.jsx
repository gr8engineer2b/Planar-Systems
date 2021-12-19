import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import TextEditor from "./texteditor.jsx";
import InfoPanel from "./infopanel.jsx";
import { Tabs, Tab, Box, IconButton, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { v4 as uuidv4 } from "uuid";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2, paddingTop: 0 }}>{children}</Box>}
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
  const [value, setValue] = useState(0);
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

  const newTabHandler = (event, localpath, filename) => {
    const newindex = tabs.length;
    const uuid = uuidv4();
    addTab(
      newindex,
      uuid,
      localpath,
      filename !== undefined ? filename : undefined
    );
    setValue(newindex);
  };

  const addTab = (index, uuid, localpath, filename) => {
    filename !== undefined
      ? setTabs([
          ...tabs,
          {
            filename: filename,
            localpath: localpath,
            index: index,
            uuid: uuid,
          },
        ])
      : setTabs([
          ...tabs,
          {
            filename: "",
            localpath: "",
            index: index,
            uuid: uuid,
          },
        ]);
    setTabEditorStates((states) => {
      states[uuid] = null;
      return states;
    });
  };

  const removeTab = (index) => {
    var newTabs;
    if (index !== undefined) {
      newTabs = tabs.filter((tab) => {
        return tab.index !== index;
      });
      if (newTabs.length === 0) {
        newTabs = [
          {
            filename: "",
            localpath: "",
            index: 0,
            uuid: uuidv4(),
          },
        ];
      } else {
        // this is a reindex step, :) it just works
        var inc = 1;
        newTabs = newTabs.map((tab) => ({
          filename: tab.filename,
          localpath: tab.localpath,
          index: inc++ - 1,
          uuid: tab.uuid,
        }));
      }
      setTabs(newTabs);
      // keeps the user on the working tab
      setValue(index < value ? value - 1 : value);
      // ToDo: handle state removeal from tabeditorstates
    }
  };

  const nameFileHandler = (uuid, filename, localpath) => {
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
          filename: filename,
          localpath: localpath,
          index: tabmatch[0].index,
          uuid: tabmatch[0].uuid,
        },
      ]);
    }
  };

  const parseFilename = (filename, trunclen) => {
    if (trunclen === undefined) trunclen = 10;
    const extention = filename.slice(
      ((filename.lastIndexOf(".") - 1) >>> 0) + 2
    );
    const name = filename.slice(0, -extention.length - 1);
    const trunc =
      name.length > trunclen ? name.slice(0, trunclen - 2) + ".." : name;
    return [trunc, extention, name];
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
        <InfoPanel
          newTabHandler={newTabHandler}
          workingDirectory={props.workingDirectory}
        />
      </div>
      <div
        style={{
          minWidth: "300px",
          width: "auto",
          overflow: "hidden",
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
            {tabs.map(({ localpath, filename, index, uuid }) => (
              <Tab
                component="div"
                className={"tabstyle"}
                key={filename !== "" ? localpath + filename : "empty-" + uuid}
                label={
                  <span>
                    {filename !== "" ? (
                      <Tooltip title={localpath}>
                        <span>
                          <div style={{ display: "inline-flex" }}>
                            {parseFilename(filename)[0]}
                          </div>
                          <div style={{ display: "inline-flex" }}>
                            .{parseFilename(filename)[1]}
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
            <Box className={"tabstyle"}>
              {/* ToDo: add as actual tab, allow user to close all tabs, deselect when no tabs are present */}
              <IconButton
                key={"new-tab"}
                onClick={newTabHandler}
                sx={{
                  display: "inline-flex",
                  height: "1em",
                  width: "1em",
                  margin: "0.5em 0",
                }}
                color="success"
              >
                <AddIcon fontSize="normal" />
              </IconButton>
            </Box>
          </Tabs>
        </Box>
        {tabs.map(({ index, localpath, filename, uuid }) => (
          <TabPanel key={uuid} value={value} index={index}>
            <TextEditor
              localpath={localpath}
              filename={filename}
              uuid={uuid}
              editorChangeHandler={editorChangeHandler}
              editorState={tabEditorStates[uuid]}
              workingDirectory={props.workingDirectory}
              nameFileHandler={nameFileHandler}
            />
          </TabPanel>
        ))}
      </div>
    </Box>
  );
};

export default AppTabs;
