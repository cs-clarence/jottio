// import React, { useEffect, useRef } from "react";
import React from "react";

import { selectFileTreeActiveFileID } from "../../../../store";
import { useAppSelector } from "../../../../store/hooks";
// import SimpleMDE from "react-simplemde-editor";
import "./NoteEditorForm.scss";

function insertAround(
  str: string,
  startIndex: number,
  endIndex: number,
  insert: string,
  insertAfter?: string
) {
  const newStr = [
    str.slice(0, startIndex),
    insert,
    str.slice(startIndex, endIndex),
    insertAfter ?? insert,
    str.slice(endIndex),
  ].join("");
  return {
    newStr,
    offsetStartIndex: startIndex + insert.length,
    offsetEndIndex: endIndex + (insertAfter ?? insert).length,
  };
}

function insertBefore(str: string, atIndex: number, insertStr: string) {
  const newStr = [str.slice(0, atIndex), insertStr, str.slice(atIndex)].join(
    ""
  );

  return {
    newStr,
    offsetIndex: atIndex + insertStr.length,
  };
}

type Props = {
  title?: string;
  note?: string;
  onTitleChange?: (title: string) => void;
  onNoteChange?: (note: string) => void;
  onFileSave?: (ev: { title: string | number; content: string }) => void;
  scrollPercent?: number;
  onScroll?: (percent: number) => void;
};

type HistoryEntity = { str: string; selStart: number; selEnd: number };
const history: HistoryEntity[] = [];

function pushToHistory(h: HistoryEntity) {
  if (history.length < 50) {
    history.push(h);
  } else {
    history.unshift();
    history.push(h);
  }
}

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
            spellCheck={false}
            readOnly={note === undefined || note === null}
            id="md-textarea"
            className="rounded-2xl bg-gray-600 my-3 flex-grow p-3 overflow-auto"
            placeholder="Notes..."
            value={note ?? ""}
            onChange={(ev) => {
              onNoteChange?.(ev.target.value);
            }}
            onKeyDown={(ev) => {
              const target = ev.nativeEvent.target as HTMLTextAreaElement;

              // tab action
              if (ev.ctrlKey) {
                switch (ev.key) {
                  case "b":
                    pushToHistory({
                      str: target.value,
                      selStart: target.selectionStart,
                      selEnd: target.selectionEnd,
                    });
                    const newValB = insertAround(
                      target.value,
                      target.selectionStart,
                      target.selectionEnd,
                      "**"
                    );
                    target.value = newValB.newStr;
                    target.setSelectionRange(
                      newValB.offsetStartIndex,
                      newValB.offsetEndIndex
                    );
                    ev.preventDefault();
                    break;
                  case "i":
                    pushToHistory({
                      str: target.value,
                      selStart: target.selectionStart,
                      selEnd: target.selectionEnd,
                    });
                    const newValI = insertAround(
                      target.value,
                      target.selectionStart,
                      target.selectionEnd,
                      "_"
                    );
                    target.value = newValI.newStr;
                    target.setSelectionRange(
                      newValI.offsetStartIndex,
                      newValI.offsetEndIndex
                    );
                    ev.preventDefault();
                    break;
                  case "x":
                    pushToHistory({
                      str: target.value,
                      selStart: target.selectionStart,
                      selEnd: target.selectionEnd,
                    });
                    const newValSS = insertAround(
                      target.value,
                      target.selectionStart,
                      target.selectionEnd,
                      "~"
                    );
                    target.value = newValSS.newStr;
                    target.setSelectionRange(
                      newValSS.offsetStartIndex,
                      newValSS.offsetEndIndex
                    );
                    ev.preventDefault();
                    break;
                  case "z":
                    const got = history.pop();
                    if (got) {
                      target.value = got.str;
                      target.setSelectionRange(got?.selStart, got.selStart);
                    }
                    ev.preventDefault();
                    break;
                  case "s":
                    onFileSave?.({ content: note ?? "", title: title ?? "" });
                    ev.preventDefault();
                    break;
                }
              } else {
                if (ev.key === "Tab") {
                  pushToHistory({
                    str: target.value,
                    selStart: target.selectionStart,
                    selEnd: target.selectionEnd,
                  });

                  const newVal = insertBefore(
                    target.value,
                    target.selectionStart,
                    "  "
                  );
                  target.value = newVal.newStr;
                  target.setSelectionRange(
                    newVal.offsetIndex,
                    newVal.offsetIndex
                  );
                  ev.preventDefault();
                } else {
                  pushToHistory({
                    str: target.value,
                    selStart: target.selectionStart,
                    selEnd: target.selectionEnd,
                  });
                }
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
