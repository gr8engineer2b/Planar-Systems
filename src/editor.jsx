import React from "react";
import MUIRichTextEditor from "mui-rte";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Preview from "./preview.jsx";
import { convertFromRaw, ContentState } from "draft-js";
import { render } from "react-dom";

var oldFileContents; // I am seriously not sure why this needs to be outside of the function and is used for overwrite protection in the event that the file is changed externally
//checksum?

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileContents: "",
    };
  }

  componentDidMount() {
    this.updateContents();
  }

  componentDidUpdate() {
    oldFileContents = this.state.fileContents;
  }

  writeFile = async (editor) => {
    const editorPlainText = convertFromRaw(JSON.parse(editor)).getPlainText();
    const overResult = await this.preventOverwrite();
    if (overResult === true) {
      // event to be logged
      console.log("Overwrite Prevented");
      //   window.location.reload(true); //use better solution than reloading everything
    } else {
      window.editorfile.write(this.props.filename, editorPlainText);
      this.updateContents();
    }
  };

  preventOverwrite = async () => {
    var currentFileData = await window.editorfile.read(this.props.filename);
    // if the file is as the editor expects, do not prevent write
    if (currentFileData == oldFileContents) {
      return false;
    } else {
      // ToDo: add option to confirm and overwrite
      return true;
    }
  };

  updateContents = async (editorstate) => {
    const data =
      editorstate === undefined
        ? await window.editorfile.read(this.props.filename)
        : editorstate;
    if (data !== undefined && typeof data === "string") {
      this.setState({ fileContents: data });
    } else if (typeof data === "object") {
      this.setState({ fileContents: data.getCurrentContent().getPlainText() });
    } else {
      console.log("No valid content");
    }
  };

  myTheme = createTheme({
    //theme setup
  });

  updCont = () => {
    return this.state.fileContents;
  };

  render() {
    console.log("editor data", this.state.fileContents);
    return (
      <ThemeProvider theme={this.myTheme}>
        <MUIRichTextEditor
          onSave={this.writeFile}
          defaultValue={JSON.stringify({
            blocks: ContentState.createFromText(
              this.state.fileContents
            ).getBlocksAsArray(),
            entityMap: {},
          })}
        />
        <Preview data={this.updCont} filename={this.props.filename} />
      </ThemeProvider>
    );
  }
}

export default Editor;
