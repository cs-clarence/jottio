import React from "react";
import "./NoteEditorPage.scss";
import NoteEditorSidebar from "./partials/NoteEditorSidebar";
import NoteEditorContainer from "./partials/NoteEditorContainer";
import Split from "react-split";

type Props = {};

function NoteEditor(props: Props) {
  return (
    <div className="w-full h-screen flex">
      <Split
        className="split"
        minSize={[200, 200]}
        sizes={[15, 85]}
        gutterSize={4}
      >
        <NoteEditorSidebar />
        <NoteEditorContainer />
      </Split>
    </div>
  );
}

export { NoteEditor as default };
