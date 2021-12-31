import React, { useState } from "react-is";

const jsonEditor = () => {
  const [editorError, setEditorError] = useState();

  return (
    <div>
      {/* editor logic placeholder */}
      <Preview
        data={editorState.getCurrentContent().getPlainText()}
        filepath={props.filepath}
        updateEditorError={updateEditorError}
      />
      ;
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
    </div>
  );
};

export default jsonEditor;
