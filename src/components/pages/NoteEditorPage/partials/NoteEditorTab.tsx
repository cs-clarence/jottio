import React, { useState } from "react";
import cn from "classnames";

type Props = {
  active?: boolean;
  onClick?: (ev: Props["id"]) => void;
  onClose?: (ev: Props["id"]) => void;
  id: string | number;
  name: string;
};

// keep track of the element being dragged
let dragged: HTMLDivElement;

function NoteEditorTab({ active, onClick, name, id, onClose }: Props) {
  const [aboutToDrop, setAboutToDrop] = useState(false);

  return (
    <div
      className={cn(
        `flex justify-center items-center px-2 bg-gray-700 overflow-hidden whitespace-nowrap relative`,
        {
          "bg-gray-800 border-gray-900 border-t-2 border-l-2 border-r-2 opacity-75": !active,
          "border-t-2": active,
          "border-yellow-100": aboutToDrop,
        }
      )}
      onDragStart={(ev) => {
        onClick?.(id);
        dragged = ev.nativeEvent.target as HTMLDivElement;
      }}
      // triggered once on a valid target
      // onDragEnter={(ev) => {
      //   // must listen to onDragOver and onDragLeave and call preventDefault on both to allow element to be a valid drop target
      //   setAboutToDrop(true);
      // }}
      // triggered multiple times while on valid drop target

      // triggered once
      onDragLeave={(ev) => {
        setAboutToDrop(false);
      }}
      // don't use DragExit as it's not supported on most browsers
      onDragExit={() => {
        // setAboutToDrop(true);
      }}
      onDragOver={(ev) => {
        // must listen to onDragOver and onDragLeave and call preventDefault on both to allow element to be a valid drop target
        setAboutToDrop(true);
        ev.preventDefault();
      }}
      // triggered once dropped on a valid drop target
      onDrop={(ev) => {
        setAboutToDrop(false);
        // preventDefault to be a valid drop target
        ev.preventDefault();
        let target = ev.nativeEvent.target as Node;
        if (!(target as HTMLDivElement).draggable) {
          target = target.parentNode as Node;
        }
        const draggedIndex = Array.prototype.indexOf.call(
          target.parentNode?.children,
          dragged
        );
        const dropIndex = Array.prototype.indexOf.call(
          (ev.nativeEvent.target as Node).parentNode?.children,
          ev.nativeEvent.target
        );

        if (draggedIndex > dropIndex) {
          target.parentNode?.insertBefore(dragged as Node, target);
        } else {
          target.parentNode?.insertBefore(dragged as Node, target.nextSibling);
        }
      }}
      onClick={(ev) => {
        onClick?.(id);
      }}
      draggable
    >
      {name}
      <div
        className="fa fa-times pl-2 cursor-pointer"
        onClick={(ev) => {
          onClose?.(id);
          ev.stopPropagation(); // stop propagation so parent onClick will not trigger on parent node
        }}
      ></div>
    </div>
  );
}
export { NoteEditorTab as default };
