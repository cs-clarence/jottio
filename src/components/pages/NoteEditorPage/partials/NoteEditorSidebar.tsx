import React, { useEffect, useState } from "react";
import "./NoteEditorSidebar.scss";
import NoteEditorSidebarTreeView from "./NoteEditorSidebarTreeView";
import { fileTreeActions, selectFileTree } from "../../../../store";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";

type Props = {};

function NoteEditorSidebar(props: Props) {
  const fileTree = useAppSelector(selectFileTree);
  const [renamingID, setRenamingID] = useState<string | number>("");
  const dispatch = useAppDispatch();

  useEffect(() => {
    document.addEventListener("click", () => {
      setRenamingID("");
    });
  }, []);

  return (
    <div className="bg-gray-800 w-80 h-full border-r-4 border-yellow-300 flex-grow">
      <NoteEditorSidebarTreeView
        rootNode
        data={fileTree}
        renamingID={renamingID}
        onRenaming={setRenamingID}
        onFileOpen={(ev) => {
          dispatch(fileTreeActions.openFile(ev));
        }}
        onFileCreate={(ev) => {
          dispatch(fileTreeActions.createFile(ev.name, ev.inFolderID));
        }}
        onFolderCreate={(ev) => {
          dispatch(fileTreeActions.createFolder(ev.name, ev.inFolderID));
        }}
        onNodeDelete={(ev) => {
          dispatch(fileTreeActions.deleteNode(ev));
        }}
        onNodeRename={(ev) => {
          dispatch(fileTreeActions.renameNode(ev));
        }}
      />
    </div>
  );
}

export { NoteEditorSidebar as default };
