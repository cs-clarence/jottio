import React, { useEffect, useRef, useState } from "react";
import {
  FileNode,
  FolderNode,
  isFileNode,
  isFolderNode as hasChildren,
} from "../../../../store";
import cn from "classnames";

type ID = number | string;
type IDPayload = {
  id: ID;
};
type IDAndNamePayload = {
  id: ID;
  name: string;
};
type NameAndFolderIDPayload = {
  name: string;
  inFolderID: ID;
};

// type IDAndContentPayload = {
//   id: ID;
//   content: string;
// };

export type Props = {
  data: FolderNode | FileNode;
  renamingID?: ID;
  onRenaming?: (id: ID) => void;
  onFileOpen?: (ev: IDPayload) => void;
  onFileCreate?: (ev: NameAndFolderIDPayload) => void;
  onFolderCreate?: (ev: NameAndFolderIDPayload) => void;
  onNodeDelete?: (ev: IDPayload) => void;
  onNodeRename?: (ev: IDAndNamePayload) => void;
  rootNode?: boolean;
};
// create recursive tree
function NoteEditorSidebarTreeView({
  data,
  renamingID,
  onRenaming,
  onNodeDelete,
  onFileCreate,
  onFileOpen,
  onFolderCreate,
  onNodeRename,
  rootNode,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(data.name);
  const inputRef = useRef<HTMLInputElement>(null);

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
            onFileOpen?.({ id: data.id });
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
            className={cn("relative", {
              "hover:underline cursor-text": !rootNode,
            })}
            onClick={(ev) => {
              if (!rootNode) {
                onRenaming?.(data.id);
                inputRef.current?.click();
                inputRef.current?.focus();
                ev.stopPropagation();
              }
            }}
          >
            {data.name || <span className="italic opacity-50">unnamed</span>}
            {renamingID === data.id && !rootNode && (
              <input
                ref={inputRef}
                className="text-black absolute w-full h-full left-0 top-0"
                type="text"
                value={name}
                onChange={(ev) => setName(ev.target.value)}
                onKeyDown={(ev) => {
                  if (ev.key === "Enter") {
                    onNodeRename?.({ id: data.id, name: name });
                    onRenaming?.("");
                  }
                }}
              />
            )}
          </span>
        </div>

        {!isFileNode(data) && (
          <>
            <span
              className="fas fa-folder-plus px-1"
              onClick={(ev) => {
                onFolderCreate?.({ inFolderID: data.id, name: "" });
                ev.stopPropagation();
                setIsOpen(true);
              }}
            ></span>
            <span
              className="fas fa-file px-1"
              onClick={(ev) => {
                onFileCreate?.({ inFolderID: data.id, name: "" });
                ev.stopPropagation();
                setIsOpen(true);
              }}
            ></span>
          </>
        )}

        {!rootNode && (
          <span
            className="fas fa-trash px-1"
            onClick={(ev) => {
              onNodeDelete?.({ id: data.id });
              ev.stopPropagation();
            }}
          ></span>
        )}
      </div>

      <div
        className={cn("pl-4 transition-all ease-in-out h-0 overflow-hidden", {
          "h-auto": isOpen,
        })}
      >
        {hasChildren(data) &&
          data.children.map((item) => {
            return (
              <NoteEditorSidebarTreeView
                key={item.id}
                data={item}
                renamingID={renamingID}
                onRenaming={onRenaming}
                onNodeDelete={onNodeDelete}
                onFileCreate={onFileCreate}
                onFileOpen={onFileOpen}
                onFolderCreate={onFolderCreate}
                onNodeRename={onNodeRename}
              />
            );
          })}
      </div>
    </div>
  );
}
export { NoteEditorSidebarTreeView as default };
