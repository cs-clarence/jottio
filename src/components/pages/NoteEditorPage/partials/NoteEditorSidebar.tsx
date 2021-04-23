import React from "react";
import "./NoteEditorSidebar.scss";
import NoteEditorSidebarTreeView from "./NoteEditorSidebarTreeView";
import { selectFileTree } from "../../../../store";
import { useAppSelector } from "../../../../store/hooks";

type Props = {};

function NoteEditorSidebar(props: Props) {
  const fileTree = useAppSelector(selectFileTree);
  return (
    <div className="bg-gray-800 w-80 h-full border-r-4 border-yellow-300 flex-grow">
      <NoteEditorSidebarTreeView data={fileTree} />
    </div>
  );
}

export { NoteEditorSidebar as default };
