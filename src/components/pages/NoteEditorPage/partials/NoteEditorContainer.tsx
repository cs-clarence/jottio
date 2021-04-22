import React, { useState } from "react";
import NoteEditorForm from "./NoteEditorForm";
import NoteEditorPreview from "./NoteEditorPreview";
import NoteEditorTabBar from "./NoteEditorTabBar";
import "./NoteEditorContainer.scss";
import Split from "react-split";

type Props = {};

function ComponentName(props: Props) {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");

  return (
    <div className="w-full h-full flex flex-col flex-shrink">
      <NoteEditorTabBar />
      <Split
        // sizes={[50, 50]}
        minSize={450}
        // gutterSize={10}
        // gutterAlign="center"
        // snapOffset={30}
        // dragInterval={1}
        direction="horizontal"
        // cursor="col-resize"
        className="split"
      >
        <NoteEditorForm
          note={note}
          title={title}
          onNoteChange={setNote}
          onTitleChange={setTitle}
        />

        <NoteEditorPreview mdText={note} />
      </Split>
    </div>
  );
}
export { ComponentName as default };
