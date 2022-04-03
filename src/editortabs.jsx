import React from "react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import EditorFrame from "./editorframe.jsx";
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
          <Typography>{children}</Typography>
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

  var tabList = tabs.map((tab) => (
    <Tab label={tab.filename} {...a11yProps(tab.index)} />
  ));

  var tabPanels = tabs.map((tab) => (
    <TabPanel value={value} index={tab.index}>
      <EditorFrame filename={tab.filename} />
    </TabPanel>
  ));

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange}>
          {tabList}
        </Tabs>
      </Box>
      {tabPanels}
    </Box>
  );
};

export default EditorTabs;
