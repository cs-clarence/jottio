import React, { useEffect, useState } from "react";
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
  const [scrollPercent, setScrollPercent] = useState(0);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (activeFile) {
      setContent(activeFile.content);
      setTitle(activeFile.name);
    }
  }, [activeFile]);

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
        className="split-inner"
      >
        <NoteEditorForm
          note={content}
          title={title}
          onTitleChange={setTitle}
          onNoteChange={setContent}
          onScroll={setScrollPercent}
          onFileSave={(ev) => {
            if (activeFile) {
              dispatch(
                fileTreeActions.updateFileContent({
                  content,
                  id: activeFile.id,
                })
              );
              dispatch(
                fileTreeActions.renameNode({ name: title, id: activeFile.id })
              );
            }
          }}
        />

        <NoteEditorPreview mdText={content} scrollPercent={scrollPercent} />
      </Split>
    </div>
  );
}
export { ComponentName as default };
