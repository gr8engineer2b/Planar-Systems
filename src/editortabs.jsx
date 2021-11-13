import React from "react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Editor from "./editor.jsx";
import { Typography, Tabs, Tab, Box } from "@mui/material";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <div>{children}</div>
        </Box>
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
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const EditorTabs = () => {
  const [value, setValue] = useState(0);
  const [tabs, setTabs] = useState([
    {
      filename: "test.txt",
      index: 0,
    },
    {
      filename: "test2.txt",
      index: 1,
    },
  ]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange}>
          {tabs.map(({ filename, index }) => (
            <Tab key={filename} label={filename} {...a11yProps(index)} />
          ))}
        </Tabs>
      </Box>
      {tabs.map(({ index, filename }) => (
        <TabPanel key={filename} value={value} index={index}>
          <Editor filename={filename} />
        </TabPanel>
      ))}
    </Box>
  );
};

export default EditorTabs;
