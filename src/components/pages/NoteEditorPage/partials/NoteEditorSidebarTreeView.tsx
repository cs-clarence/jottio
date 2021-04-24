import React, { useState } from "react";
import {
  FileNode,
  FolderNode,
  isFileNode,
  isTree,
  noteEditorActions,
} from "../../../../store";
import { useAppDispatch } from "../../../../store/hooks";
import cn from "classnames";

export type Props = {
  data: FolderNode;
  level?: number;
  onFileOpen?: (ev: FileNode) => void;
  onFileCreate?: (ev: FileNode) => void;
  onFolderCreate?: (ev: FolderNode) => void;
};

// create recursive tree
function NoteEditorSidebarTreeView({ data, level }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();

  return (
    <div className="select-none cursor-pointer">
      <div
        className={cn("", {
          "bg-white bg-opacity-10 px-1 rounded-l-lg flex items-center": !isFileNode(
            data
          ),
        })}
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
      >
        <span
          className={cn(
            "fas fa-caret-right transform rotate-0 px-1 transition-transform",
            {
              "rotate-90": isOpen,
            }
          )}
        ></span>
        <span className="fas fa-folder px-1"></span>
        <div className="flex-grow">
          <span
            className="hover:underline cursor-text"
            onClick={(ev) => ev.stopPropagation()}
          >
            {data.name}
          </span>
        </div>
        <span className="fas fa-folder-plus px-1"></span>
        <span className="fas fa-file px-1"></span>
        <span className="fas fa-trash px-1"></span>
      </div>
      <div className={cn("pl-4", { hidden: !isOpen })}>
        {data.children.map((item) => {
          return (
            <React.Fragment key={item.id}>
              {(isTree(item) && (
                <NoteEditorSidebarTreeView data={item} level={level ?? 2} />
              )) ||
                (isFileNode(item) && (
                  <div
                    onClick={() => {
                      dispatch(
                        noteEditorActions.openFile({
                          id: item.id,
                          content: item.content,
                          name: item.name,
                        })
                      );
                    }}
                    className="flex px-1"
                  >
                    <span className="fas fa-circle px-1 transform scale-50"></span>
                    <span className="fas fa-file px-1"></span>
                    <div className="flex-grow">
                      <span
                        className="hover:underline cursor-text"
                        onClick={(ev) => ev.stopPropagation()}
                      >
                        {item.name}
                      </span>
                    </div>
                    <span className="fas fa-trash px-1"></span>
                  </div>
                ))}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
export { NoteEditorSidebarTreeView as default };
