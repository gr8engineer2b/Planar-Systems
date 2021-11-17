import React, { useState, useEffect } from "react";
import MUIRichTextEditor from "mui-rte";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Preview from "./preview.jsx";
import { convertFromRaw, ContentState } from "draft-js";
import { render } from "react-dom";

const Editor = (props) => {
  const [fileContents, setfileContents] = useState("");

  var oldFileContents; //checksum instead?

  useEffect(() => {
    updateContents();
  }, []);

  useEffect(() => {
    oldFileContents = fileContents;
  }, [fileContents]);

  const writeFile = async (editor) => {
    const editorPlainText = convertFromRaw(JSON.parse(editor)).getPlainText();
    const overResult = await preventOverwrite();
    if (overResult === true) {
      // event to be logged
      console.log("Overwrite Prevented");
      //   window.location.reload(true); //use better solution than reloading everything
    } else {
      window.editorfile.write(props.filename, editorPlainText);
      updateContents();
    }
  };

  const preventOverwrite = async () => {
    var currentFileData = await window.editorfile.read(props.filename);
    // if the file is as the editor expects, do not prevent write
    if (currentFileData == oldFileContents) {
      return false;
    } else {
      // ToDo: add option to confirm and overwrite
      return true;
    }
  };

  const updateContents = async (editorstate) => {
    const data =
      editorstate === undefined
        ? await window.editorfile.read(props.filename)
        : editorstate;
    if (data !== undefined && typeof data === "string") {
      setfileContents(data);
    } else if (typeof data === "object") {
      setfileContents(data.getCurrentContent().getPlainText());
    } else {
      console.log("No valid content");
    }
  };

  const myTheme = createTheme({
    //theme setup
  });

  return (
    <ThemeProvider theme={myTheme}>
      {/* check for file contents here?*/}
      <MUIRichTextEditor
        onSave={writeFile}
        defaultValue={JSON.stringify({
          blocks: ContentState.createFromText(fileContents).getBlocksAsArray(),
          entityMap: {},
        })}
      />
      <Preview data={fileContents} filename={props.filename} />
    </ThemeProvider>
  );
};

export default Editor;
