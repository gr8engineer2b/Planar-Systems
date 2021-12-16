import React, { useState, useEffect } from "react";
import { Editor } from "react-draft-wysiwyg";
import "../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Preview from "./preview.jsx";
import {
  convertFromRaw,
  EditorState,
  ContentState,
  SelectionState,
  Modifier,
} from "draft-js";
import {
  Box,
  Alert,
  Tooltip,
  Dialog,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  DialogTitle,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const SaveButton = (props) => {
  const [namePrompt, setNamePrompt] = useState(false);
  const [newFileName, setNewFileName] = useState();
  // ToDo: implement choosing directory location, for now default to root
  const [newLocalPath, setNewLocalPath] = useState("/");

  const saveHandler = async (filename, localpath) => {
    const saveDirectory = localpath
      ? props.workingDirectory + localpath
      : props.workingDirectory;
    filename = filename ? filename : props.filename;
    console.log(saveDirectory, filename);
    if (filename === "") {
      promptOpenHandler();
    } else {
      try {
        const contentState = props.editorState.getCurrentContent();
        let contentPlainText = null;
        //try to parse as JSON string and create a new draft js content state
        try {
          contentPlainText = convertFromRaw(
            JSON.parse(contentState)
          ).getPlainText();
        } catch (err1) {
          //try to get plain text from draft js
          try {
            contentPlainText = contentState.getPlainText();
          } catch (err2) {
            console.log("Cannot handle save: " + err1 + " and " + err2);
          }
        }
        //prevent saving nothing
        const overResult = props.filename ? await preventOverwrite() : false;
        if (overResult) {
          // event to be logged
          console.log("Overwrite Prevented");
        } else {
          // write to file
          window.editorfile.writefile(
            saveDirectory,
            filename,
            contentPlainText
          );
          props.setOldFileContents(contentPlainText);
          props.seteditorSuccess(true);
        }
      } catch (err) {
        console.log("Unable to update state, Invalid object: " + err);
      }
    }
  };

  const preventOverwrite = async () => {
    var currentFileData = await window.editorfile.readfile(
      props.workingDirectory + props.localpath,
      props.filename
    );
    // if the file is not as the editor expects, prevent write
    if (currentFileData === props.oldFileContents) {
      return false;
    } else {
      // ToDo: add option to confirm and overwrite
      return true;
    }
  };

  const promptCloseHandler = (filename, localpath) => {
    if (filename !== undefined) {
      props.nameFileHandler(props.uuid, filename, localpath);
      saveHandler(filename, localpath);
      setNamePrompt(false);
    } else {
      setNamePrompt(false);
    }
  };

  const promptOpenHandler = () => {
    setNamePrompt(true);
  };

  return (
    <div>
      <Dialog open={namePrompt} onClose={promptCloseHandler}>
        <DialogTitle>Enter File Name</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="File Name"
            type="text"
            fullWidth
            variant="standard"
            onChange={(event) => setNewFileName(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => promptCloseHandler()}>Close</Button>
          <Button onClick={() => promptCloseHandler(newFileName, newLocalPath)}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <div
        disabled
        onClick={() => saveHandler()}
        className="rdw-option-wrapper"
      >
        <SaveIcon
          color="secondary"
          sx={{
            height: "20px",
          }}
        />
      </div>
    </div>
  );
};

const EditorFrame = (props) => {
  const [editorState, setEditorState] = useState(
    props.editorState ? props.editorState : EditorState.createEmpty()
  );
  const [oldFileContents, setOldFileContents] = useState("");
  const [editorError, setEditorError] = useState();
  const [editorSuccess, seteditorSuccess] = useState(false);

  const updateEditorError = (error) => {
    setEditorError(error);
  };

  useEffect(() => {
    // gets initial file data but doesn't overwrite state saved in editortabs
    grabInital();
  }, []);

  const grabInital = async () => {
    if (
      props.filename !== "" &&
      editorState.getCurrentContent().getPlainText() === ""
    ) {
      const data = await window.editorfile.readfile(
        props.workingDirectory + props.localpath,
        props.filename
      );
      if (data !== undefined && typeof data === "string") {
        try {
          setEditorState(
            EditorState.createWithContent(ContentState.createFromText(data))
          );
          setOldFileContents(data);
        } catch (err) {
          console.log("EditorState creation failed: " + err);
        }
      } else {
        console.log("Unable to update state, No valid content");
      }
    }
  };

  const onEditorStateChange = (editorState) => {
    props.editorChangeHandler(editorState, props.uuid);
    seteditorSuccess(false);
    setEditorState(editorState);
  };

  // const escapeHandler // required for getting out of the editor
  const tabHandler = (event) => {
    event.preventDefault(); // prevents tabbing to next indexable element, this is required despite docs claiming otherwise, feel free to test at any point
    // handle tab logic for general editor indentation
    const tabValue = "  "; //two space tab ToDo: add option for other tab values
    const contentState = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const endKey = selection.getEndKey();
    const startKey = selection.getStartKey();
    var newEditorState = EditorState.createWithContent(
      editorState.getCurrentContent()
    );
    var activeKey;
    do {
      // clear newContentState
      var newContentState;
      // this behavior allows going through each content block until the end of the selection is reached
      activeKey = activeKey
        ? contentState.getBlockAfter(activeKey).getKey()
        : startKey;
      if (!event.shiftKey) {
        newContentState = Modifier.insertText(
          newEditorState.getCurrentContent(),
          SelectionState.createEmpty(activeKey),
          tabValue
        );
      } else {
        // inverse indent behavior, checks for tab character at beginning of string
        const tabReg = new RegExp(`^${tabValue}`);
        if (tabReg.test(contentState.getBlockForKey(activeKey).getText())) {
          var newSelectionState = SelectionState.createEmpty(activeKey);
          newSelectionState = newSelectionState.merge({
            focusOffset: tabValue.length,
          });
          newContentState = Modifier.replaceText(
            newEditorState.getCurrentContent(),
            newSelectionState,
            ""
          );
        }
      }
      if (newContentState) {
        newEditorState = EditorState.push(
          newEditorState,
          newContentState,
          "insert-character"
        );
      }
    } while (activeKey !== endKey);
    // if there was a change
    if (newEditorState !== editorState) {
      // apply new content to old state, this cleans up the undo stack better and prevents the user from having to undo each indent one at a time
      // adjust-depth is technically wrong however I do not see the problem with labeling it this way yet
      newEditorState = EditorState.push(
        editorState,
        newContentState,
        "adjust-depth"
      );
      const newSelectionState = selection.merge({
        focusOffset:
          selection.getFocusOffset() +
          (event.shiftKey ? -tabValue.length : tabValue.length),
        anchorOffset:
          selection.getAnchorOffset() +
          (event.shiftKey ? -tabValue.length : tabValue.length),
      });
      newEditorState = EditorState.forceSelection(
        newEditorState,
        newSelectionState
      );
      setEditorState(newEditorState);
    }
  };

  const windowIsSmall = () => {
    return document.getElementById("root").scrollHeight < 600;
  };

  return (
    <Box className="editor-panel" sx={{ color: "text.primary" }}>
      <Editor
        toolbar={{ options: ["history"] }}
        toolbarStyle={{
          backgroundColor: "inherit",
          borderWidth: "0",
        }}
        editorStyle={{
          padding: "10px",
          overflowY: "auto",
          display: "block",
          maxHeight: "50vh",
          border: "2px solid rgba(9,9,9,0.5)",
          borderRadius: "10px",
        }}
        toolbarCustomButtons={[
          <SaveButton
            filename={props.filename}
            oldFileContents={oldFileContents}
            seteditorSuccess={seteditorSuccess}
            setOldFileContents={setOldFileContents}
            workingDirectory={props.workingDirectory}
            localpath={props.localpath}
            updateEditorError={updateEditorError}
            nameFileHandler={props.nameFileHandler}
            uuid={props.uuid}
          />,
        ]}
        editorState={editorState}
        wrapperClassName="wrapper"
        editorClassName="editor"
        onEditorStateChange={onEditorStateChange}
        onTab={tabHandler}
      />
      <Preview
        data={editorState.getCurrentContent().getPlainText()}
        filename={props.filename}
        updateEditorError={updateEditorError}
      />
      {editorError !== undefined && (
        <Tooltip title={editorError}>
          <Alert
            sx={
              windowIsSmall()
                ? { display: "inline-block", width: "22px", height: "38px" }
                : {}
            }
            severity="error"
          >
            {windowIsSmall() ? "" : editorError}
          </Alert>
        </Tooltip>
      )}
      {editorSuccess === true && (
        <Tooltip title={"Saved " + props.filename}>
          <Alert
            sx={
              windowIsSmall()
                ? { display: "inline-block", width: "22px", height: "38px" }
                : {}
            }
            severity="success"
          >
            {windowIsSmall() ? "" : "Saved " + props.filename}
          </Alert>
        </Tooltip>
      )}
    </Box>
  );
};

export default EditorFrame;