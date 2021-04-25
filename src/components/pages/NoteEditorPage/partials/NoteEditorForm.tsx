// import React, { useEffect, useRef } from "react";
import React from "react";

import { selectFileTreeActiveFileID } from "../../../../store";
import { useAppSelector } from "../../../../store/hooks";
// import SimpleMDE from "react-simplemde-editor";
import "./NoteEditorForm.scss";

type Props = {
  title?: string;
  note?: string;
  onTitleChange?: (title: string) => void;
  onNoteChange?: (note: string) => void;
  onFileSave?: (ev: { title: string | number; content: string }) => void;
  scrollPercent?: number;
  onScroll?: (percent: number) => void;
};

function NoteEditorForm({
  onNoteChange,
  onTitleChange,
  note,
  title,
  onFileSave,
  scrollPercent,
  onScroll,
}: Props) {
  const activeID = useAppSelector(selectFileTreeActiveFileID);

  return (
    <div className="w-full h-full bg-gray-700 flex flex-col px-3">
      {!!activeID && (
        <>
          <input
            readOnly={title === undefined || title === null}
            id="title"
            type="text"
            className="rounded-2xl bg-gray-600 mt-3 h-10 px-3"
            placeholder="Title"
            value={title ?? ""}
            onChange={(ev) => {
              onTitleChange?.(ev.target.value);
            }}
            onKeyDown={(ev) => {
              if (ev.ctrlKey && ev.key === "s") {
                onFileSave?.({ content: note ?? "", title: title ?? "" });

                ev.preventDefault();
                ev.stopPropagation();
              }
            }}
          />
          {/* <div className="flex-grow bg-gray-600 my-3 p-3 rounded-2xl">
            <SimpleMDE
              className="simplemde"
              value={note}
              onChange={(ev) => {
                onNoteChange?.(ev);
              }}
            ></SimpleMDE>
          </div> */}
          <textarea
            readOnly={note === undefined || note === null}
            id="md-textarea"
            className="rounded-2xl bg-gray-600 my-3 flex-grow p-3 overflow-auto"
            placeholder="Notes..."
            value={note ?? ""}
            onChange={(ev) => {
              onNoteChange?.(ev.target.value);
            }}
            onKeyDown={(ev) => {
              if (ev.ctrlKey && ev.key === "s") {
                onFileSave?.({ content: note ?? "", title: title ?? "" });

                ev.preventDefault();
                ev.stopPropagation();
              }
              if (ev.key === "Tab") {
                onFileSave?.({ content: note ?? "", title: title ?? "" });

                ev.preventDefault();
                ev.stopPropagation();
              }
            }}
            onScroll={(ev) => {
              const maxScroll =
                (ev.nativeEvent.target as HTMLTextAreaElement).scrollHeight -
                (ev.nativeEvent.target as HTMLTextAreaElement).clientHeight;
              const currentScroll = (ev.nativeEvent
                .target as HTMLTextAreaElement).scrollTop;

              if (currentScroll) {
                onScroll?.(currentScroll / maxScroll);
              } else {
                onScroll?.(0);
              }
            }}
          />
        </>
      )}
    </div>
  );
}
export { NoteEditorForm as default };
