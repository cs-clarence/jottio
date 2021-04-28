import React, { useEffect, useState } from "react";
import "./NoteEditorSidebar.scss";
import NoteEditorSidebarTreeView from "./NoteEditorSidebarTreeView";
import { fileTreeActions, selectRoot } from "../../../../store";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";

type Props = {};

function NoteEditorSidebar(props: Props) {
  const root = useAppSelector(selectRoot);
  const [renamingID, setRenamingID] = useState<string | number>("");
  const dispatch = useAppDispatch();

  useEffect(() => {
    document.addEventListener("click", () => {
      setRenamingID("");
    });
  }, []);

  return (
    <div className="bg-gray-800 w-80 h-full flex-grow">
      {root && (
        <NoteEditorSidebarTreeView
          rootNode
          data={root}
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
            dispatch(fileTreeActions.deleteEntity(ev));
          }}
          onNodeRename={(ev) => {
            dispatch(fileTreeActions.renameNode(ev));
          }}
        />
      )}
    </div>
  );
}

export { NoteEditorSidebar as default };
