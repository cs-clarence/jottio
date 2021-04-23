import React from "react";
import NoteEditorForm from "./NoteEditorForm";
import NoteEditorPreview from "./NoteEditorPreview";
import NoteEditorTabBar from "./NoteEditorTabBar";
import "./NoteEditorContainer.scss";
import Split from "react-split";
import { useAppSelector } from "../../../../store/hooks";
import { selectNoteEditorActiveFile } from "../../../../store";

type Props = {};

function ComponentName(props: Props) {
  const activeFile = useAppSelector(selectNoteEditorActiveFile);

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
        <NoteEditorForm note={activeFile?.content} title={activeFile?.name} />

        <NoteEditorPreview mdText={activeFile?.content} />
      </Split>
    </div>
  );
}
export { ComponentName as default };
