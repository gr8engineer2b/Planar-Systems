import React, { useEffect, useState } from "react";
import GridMenu from "./gridmenu.jsx";
import TextEditor from "./texteditor.jsx";

const AppTab = ({
  uuid,
  filepath,
  state,
  editorChangeHandler,
  nameFileHandler,
}) => {
  return (
    <GridMenu filepath={filepath} />
    // <TextEditor
    //   filepath={filepath}
    //   uuid={uuid}
    //   editorChangeHandler={editorChangeHandler}
    //   editorState={state}
    //   nameFileHandler={nameFileHandler}
    // />
  );
};

export default AppTab;
