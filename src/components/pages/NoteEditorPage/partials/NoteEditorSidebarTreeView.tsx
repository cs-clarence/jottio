import React, { useEffect, useState } from "react";
import {
  FileNode,
  FolderNode,
  isFileNode,
  isFolderNode,
  noteEditorActions,
  fileTreeActions,
} from "../../../../store";
import { useAppDispatch } from "../../../../store/hooks";
import cn from "classnames";

export type Props = {
  data: FolderNode | FileNode;
  renamingID?: string | number;
  onRenaming?: (id: string | number) => void;
  onFileOpen?: (ev: FileNode) => void;
  onFileCreate?: (ev: FileNode) => void;
  onFolderCreate?: (ev: FolderNode) => void;
};
// create recursive tree
function NoteEditorSidebarTreeView({ data, renamingID, onRenaming }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(data.name);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setName(data.name);
  }, [renamingID, data.name]);

  return (
    <div className="select-none cursor-pointer">
      <div
        className={cn("flex items-center px-1", {
          "bg-white bg-opacity-10 rounded-l-lg": !isFileNode(data),
        })}
        onClick={() => {
          if (isFileNode(data)) {
            dispatch(
              noteEditorActions.openFile({
                id: data.id,
                content: data.content,
                name: data.name,
              })
            );
          } else {
            setIsOpen((prev) => !prev);
          }
        }}
      >
        {(isFileNode(data) && (
          <>
            <span className="fas fa-circle px-1 transform scale-50"></span>
            <span className="fas fa-file px-1"></span>
          </>
        )) || (
          <>
            <span
              className={cn(
                "fas fa-caret-right transform rotate-0 px-1 transition-transform",
                {
                  "rotate-90": isOpen,
                }
              )}
            ></span>
            <span className="fas fa-folder px-1"></span>
          </>
        )}
        <div className="flex-grow">
          <span
            className="hover:underline cursor-text relative"
            onClick={(ev) => {
              onRenaming?.(data.id);
              ev.stopPropagation();
            }}
          >
            {data.name}
            {renamingID === data.id && (
              <input
                className="text-black absolute w-full h-full left-0 top-0"
                type="text"
                value={name}
                onChange={(ev) => setName(ev.target.value)}
                onKeyDown={(ev) => {
                  if (ev.key === "Enter") {
                    dispatch(fileTreeActions.renameNode({ id: data.id, name }));
                    onRenaming?.("");
                  }
                }}
              />
            )}
          </span>
        </div>

        {!isFileNode(data) && (
          <>
            <span className="fas fa-folder-plus px-1"></span>
            <span className="fas fa-file px-1"></span>
          </>
        )}

        <span className="fas fa-trash px-1"></span>
      </div>

      <div className={cn("pl-4", { hidden: !isOpen })}>
        {isFolderNode(data) &&
          data.children.map((item) => {
            return (
              <NoteEditorSidebarTreeView
                key={item.id}
                data={item}
                renamingID={renamingID}
                onRenaming={onRenaming}
              />
            );
          })}
      </div>
    </div>
  );
}
export { NoteEditorSidebarTreeView as default };
