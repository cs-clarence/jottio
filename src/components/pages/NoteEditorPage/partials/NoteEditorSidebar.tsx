import React, { useEffect, useState } from "react";
import "./NoteEditorSidebar.scss";
import NoteEditorSidebarTreeView from "./NoteEditorSidebarTreeView";
import { selectFileTree } from "../../../../store";
import { useAppSelector } from "../../../../store/hooks";

type Props = {};

function NoteEditorSidebar(props: Props) {
  const fileTree = useAppSelector(selectFileTree);
  const [renamingID, setRenamingID] = useState<string | number>("");

  useEffect(() => {
    document.addEventListener("click", () => {
      setRenamingID("");
    });
  }, []);

  return (
    <div className="bg-gray-800 w-80 h-full border-r-4 border-yellow-300 flex-grow">
      <NoteEditorSidebarTreeView
        data={fileTree}
        renamingID={renamingID}
        onRenaming={setRenamingID}
      />
    </div>
  );
}

export { NoteEditorSidebar as default };
