import React from "react";
import NoteEditorForm from "./NoteEditorForm";
import NoteEditorPreview from "./NoteEditorPreview";
import NoteEditorTabBar from "./NoteEditorTabBar";
import "./NoteEditorContainer.scss";
import Split from "react-split";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { fileTreeActions, selectFileTreeActiveFile } from "../../../../store";

type Props = {};

// TODO: Create a more efficient way to save files

function ComponentName(props: Props) {
  const activeFile = useAppSelector(selectFileTreeActiveFile);
  const dispatch = useAppDispatch();

  return (
    <div className="w-full h-full flex flex-col flex-shrink">
      <NoteEditorTabBar />
      <Split
        // sizes={[50, 50]}
        minSize={450}
        // gutterSize={10}
        // gutterAlign="center"
        // snapOffset={30}
        // dragInterval={1}
        direction="horizontal"
        // cursor="col-resize"
        className="split"
      >
        <NoteEditorForm
          note={activeFile?.content}
          title={activeFile?.name}
          onTitleChange={(ev) =>
            dispatch(
              fileTreeActions.renameNode({ id: activeFile.id, name: ev })
            )
          }
          onNoteChange={(ev) =>
            dispatch(
              fileTreeActions.updateFileContent({
                id: activeFile.id,
                content: ev,
              })
            )
          }
        />

        <NoteEditorPreview mdText={activeFile?.content} />
      </Split>
    </div>
  );
}
export { ComponentName as default };
