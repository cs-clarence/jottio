import React from "react";
import { useSelector } from "react-redux";
import NoteEditorTab from "./NoteEditorTab";
import {
  selectFileTreeOpenFiles,
  selectFileTreeActiveFileID,
  fileTableActions,
} from "../../../../store";
import { useAppDispatch } from "../../../../store/hooks";

type Props = {};

function NoteEditorTabBar(props: Props) {
  const tabs = useSelector(selectFileTreeOpenFiles);
  const activeID = useSelector(selectFileTreeActiveFileID);
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
            onClick={(ev) => dispatch(fileTableActions.setActiveFileID(ev))}
            onClose={(ev) => dispatch(fileTableActions.closeFile({ id: ev }))}
          />
        );
      })}
    </div>
  );
}
export { NoteEditorTabBar as default };
