import React, { useRef, useState } from "react";
import cn from "classnames";

type Props = {
  active?: boolean;
  onClick?: (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => {};
};

// keep track of the element being dragged
let dragged: HTMLDivElement;

function NoteEditorTab({ active, onClick }: Props) {
  const [aboutToDrop, setAboutToDrop] = useState(false);
  const thisDiv = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={thisDiv}
      className={cn(
        `flex justify-center items-center px-2 bg-gray-700 overflow-hidden whitespace-nowrap relative`,
        {
          "bg-gray-800 border-gray-900 border-t-2 border-l-2 border-r-2 opacity-75": !active,
          "border-t-2": active,
          "border-yellow-100": aboutToDrop,
        }
      )}
      onDragStart={(ev) => {
        dragged = ev.nativeEvent.target as HTMLDivElement;
      }}
      onDragEnter={(ev) => {
        // must listen to onDragOver and onDragLeave and call preventDefault on both to allow element to be a valid drop target
        setAboutToDrop(true);
        ev.preventDefault();
      }}
      onDragOver={(ev) => {
        // must listen to onDragOver and onDragLeave and call preventDefault on both to allow element to be a valid drop target
        ev.preventDefault();
      }}
      onDragLeave={(ev) => {}}
      onDragExit={() => {
        setAboutToDrop(false);
      }}
      onDrop={(ev) => {
        setAboutToDrop(false);
        ev.preventDefault();
        const draggedIndex = Array.prototype.indexOf.call(
          (ev.nativeEvent.target as HTMLDivElement).parentNode?.children,
          dragged
        );
        const dropIndex = Array.prototype.indexOf.call(
          (ev.nativeEvent.target as HTMLDivElement).parentNode?.children,
          ev.nativeEvent.target
        );
        if (draggedIndex > dropIndex) {
          (ev.nativeEvent.target as HTMLElement).parentNode?.insertBefore(
            dragged as Node,
            ev.nativeEvent.target as Node
          );
        } else {
          (ev.nativeEvent.target as HTMLElement).parentNode?.insertBefore(
            dragged as Node,
            (ev.nativeEvent.target as Node).nextSibling
          );
        }
      }}
      onClick={(ev) => {
        onClick?.(ev);
      }}
      draggable
    >
      Hello World
      <span
        className="fa fa-times pl-2 cursor-pointer absolute right-1 top-1/4 rounded-full"
        onClick={(ev) => {
          (ev.nativeEvent
            .target as HTMLSpanElement).parentElement?.parentElement?.removeChild(
            thisDiv.current as Node
          );
        }}
      ></span>
    </div>
  );
}
export { NoteEditorTab as default };
