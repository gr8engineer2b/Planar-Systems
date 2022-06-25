import { Paper, Box, Switch, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Character from "./character.jsx";
import Item from "./Item.jsx";

const Preview = (props) => {
  const [previews, setPreviews] = useState([]);
  const [checked, setChecked] = React.useState(false);

  // props.updateEditorError() without args is used to set the error to undefined, causing nothing to be displayed
  useEffect(() => {
    //checking for null
    if (props.data) {
      try {
        const json = JSON.parse(props.data);
        //if there is a change to be made
        if (Array.isArray(json)) {
          if (JSON.stringify(previews) !== JSON.stringify(json)) {
            setPreviews([...json.map((obj) => obj)]);
          }
        } else if (json.constructor === Object) {
          if (JSON.stringify(previews) !== JSON.stringify([json])) {
            setPreviews([json]);
          }
        }
        props.updateEditorError();
      } catch (err) {
        props.updateEditorError(
          "Please remedy your JSON error in " + props.filepath + ":\n" + err
        );
      }
    } else props.updateEditorError();
  });

  const boxsx = {
    padding: 1,
    display: "inline-block",
    verticalAlign: "top",
  };

  const handlePreviewCheck = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <div>
      <Switch
        color="secondary"
        disabled={previews.length === 0}
        onChange={handlePreviewCheck}
        sx={{ float: "right" }}
      />
      <Box
        sx={{
          maxHeight: "20vh",
          overflowY: "auto",
          padding: "5px 5px 5px 58px",
          margin: "2px",
          borderRadius: 1,
        }}
      >
        {previews.length > 0 ? (
          <Typography textAlign="center">Preview</Typography>
        ) : (
          <Typography textAlign="center" color="text.disabled">
            Nothing to Preview
          </Typography>
        )}
      </Box>
      {previews.length > 0 && checked && (
        <Paper
          sx={{
            padding: 1,
            marginTop: 1,
            marginBottom: 1,
            justifyContent: "center",
            display: "block",
            position: "sticky",
            bottom: 0,
          }}
          elevation={3}
          className="previewpane"
        >
          {previews.length > 1
            ? previews.map((obj) => {
                if (obj.type === "character")
                  return (
                    <Box key={obj.name + "-box"} sx={boxsx}>
                      <Character key={obj.name} object={obj} />
                    </Box>
                  );
                if (obj.type === "item")
                  return (
                    <Box key={obj.name + "-box"} sx={boxsx}>
                      <Item key={obj.name} object={obj} />
                    </Box>
                  );
              })
            : previews[0] &&
              (previews[0].type === "character" ? (
                <Character key={previews[0].name} object={previews[0]} />
              ) : (
                previews[0].type === "item" && (
                  <Item key={previews[0].name} object={previews[0]} />
                )
              ))}
        </Paper>
      )}
    </div>
  );
};

export default Preview;
