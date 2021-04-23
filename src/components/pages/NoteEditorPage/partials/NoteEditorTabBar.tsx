import React from "react";
import { useSelector } from "react-redux";
import NoteEditorTab from "./NoteEditorTab";
import {
  selectNoteEditorFiles,
  selectNoteEditorActiveID,
  noteEditorActions,
} from "../../../../store";
import { useAppDispatch } from "../../../../store/hooks";

type Props = {};

function NoteEditorTabBar(props: Props) {
  const tabs = useSelector(selectNoteEditorFiles);
  const activeID = useSelector(selectNoteEditorActiveID);
  const dispatch = useAppDispatch();
  return (
    <div className="h-10 bg-gray-800 w-full flex flex-row select-none">
      {tabs.map((item) => {
        return (
          <NoteEditorTab
            name={item.name}
            id={item.id}
            active={activeID === item.id}
            key={item.id}
            onClick={(ev) => dispatch(noteEditorActions.setActiveID(ev))}
            onClose={(ev) => dispatch(noteEditorActions.closeFile({ id: ev }))}
          />
        );
      })}
    </div>
  );
}
export { NoteEditorTabBar as default };
