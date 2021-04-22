import React from "react";
import NoteEditorSidebar from "./partials/NoteEditorSidebar";
import NoteEditorContainer from "./partials/NoteEditorContainer";

type Props = {};

function NoteEditor(props: Props) {
  return (
    <div className="w-full h-screen flex">
      <NoteEditorSidebar />
      <NoteEditorContainer />
    </div>
  );
}

export { NoteEditor as default };
