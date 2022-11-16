import React, { useState } from "react-is";

const jsonEditor = (props) => {
  const [editorError, setEditorError] = useState();

  return (
    <div>
      {/* editor logic placeholder */}
      <Preview
        data={props.data}
        filepath={props.filepath}
        updateEditorError={updateEditorError}
      />
      ;
      {editorError !== undefined && (
        <Tooltip title={editorError}>
          <Alert
            sx={{ display: "inline-block", width: "22px", height: "38px" }}
            severity="error"
          >
            {editorError}
          </Alert>
        </Tooltip>
      )}
    </div>
  );
};

export default jsonEditor;
