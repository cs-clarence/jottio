import React from "react";
import NoteEditorTab from "./NoteEditorTab";

type Props = {};

function NoteEditorTabBar(props: Props) {
  return (
    <div className="h-10 bg-gray-800 w-full flex flex-row select-none">
      <NoteEditorTab active />
      <NoteEditorTab />
      <NoteEditorTab />
      <NoteEditorTab />
      <NoteEditorTab />
      <NoteEditorTab />
      <NoteEditorTab />
      <NoteEditorTab />
      <NoteEditorTab />
      <NoteEditorTab />
      <NoteEditorTab />
      <NoteEditorTab />
      <NoteEditorTab />
    </div>
  );
}
export { NoteEditorTabBar as default };
