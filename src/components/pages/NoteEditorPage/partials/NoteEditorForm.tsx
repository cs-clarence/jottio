import React from "react";
import { selectNoteEditorActiveID } from "../../../../store";
import { useAppSelector } from "../../../../store/hooks";
import "./NoteEditorForm.scss";

type Props = {
  title?: string;
  note?: string;
  onTitleChange?: (title: string) => void;
  onNoteChange?: (note: string) => void;
};

function NoteEditorForm({ onNoteChange, onTitleChange, note, title }: Props) {
  const activeID = useAppSelector(selectNoteEditorActiveID);

  return (
    <div className="w-full h-full bg-gray-700 flex flex-col px-3">
      {!!activeID && (
        <>
          <input
            id="title"
            type="text"
            className="rounded-2xl bg-gray-600 mt-3 h-10 px-3"
            placeholder="Title"
            value={title ?? ""}
            onChange={(ev) => {
              onTitleChange?.(ev.target.value);
            }}
          />

          <textarea
            id="md-textarea"
            className="rounded-2xl bg-gray-600 my-3 flex-grow p-3 overflow-auto"
            placeholder="Notes..."
            value={note ?? ""}
            onChange={(ev) => {
              onNoteChange?.(ev.target.value);
            }}
          />
        </>
      )}
    </div>
  );
}
export { NoteEditorForm as default };
