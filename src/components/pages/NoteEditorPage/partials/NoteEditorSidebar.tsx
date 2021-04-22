import React from "react";
import { v4 as uuid } from "uuid";
import "./NoteEditorSidebar.scss";
import NoteEditorSidebarTreeView, {
  FileNode,
  Tree,
} from "./NoteEditorSidebarTreeView";

type Props = {};

const dummyData: Tree = {
  id: uuid(),
  name: "Root",
  children: [
    {
      id: uuid(),
      name: "Folder 1",
      children: [
        { id: uuid(), name: "Hello World", content: "asdf" },
        { id: uuid(), name: "Hello World", content: "asdf" },
      ],
    },
    {
      id: uuid(),
      name: "Folder 2",
      children: [
        { id: uuid(), name: "Hello World", content: "asdf" },
        { id: uuid(), name: "Hello World", content: "asdf" },
      ],
    },
  ],
};

function NoteEditorSidebar(props: Props) {
  return (
    <div className="bg-gray-800 w-80 h-full border-r-4 border-yellow-300 flex-grow">
      <NoteEditorSidebarTreeView data={dummyData} />
    </div>
  );
}

export { NoteEditorSidebar as default };
