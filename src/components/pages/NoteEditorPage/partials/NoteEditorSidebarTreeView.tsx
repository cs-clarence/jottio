import React from "react";

export type Node = {
  id: string | number;
  name: string;
};
export type FileNode = Node & {
  content: string;
};
export type Tree = Node & {
  children: (Tree | FileNode | Node)[];
};
function isFileNode(x: FileNode | Node): x is FileNode {
  return !!(x as FileNode).content;
}

function isTree(x: FileNode | Tree | Node): x is Tree {
  return !!(x as Tree).children;
}

type Props = { data: Tree };

// create recursive tree
function NoteEditorSidebarTreeView({ data }: Props) {
  return (
    <div>
      {data.name}
      {data.children.map((item, index) => {
        return (
          <div key={index}>
            {item.name}
            {isTree(item) && item.children.length > 0 && (
              <ul>
                {item.children.map((item, index) => {
                  return <li key={index}>{item?.name}</li>;
                })}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
export { NoteEditorSidebarTreeView as default };
