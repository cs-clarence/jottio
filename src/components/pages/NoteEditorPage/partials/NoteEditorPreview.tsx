import marked from "marked";
import { throttle } from "lodash";
import "./NoteEditorPreview.scss";
import React, { useEffect, useRef } from "react";

type Props = {
  mdText: string;
  scrollPercent?: number;
  onScroll?: (percent: number) => void;
};

const render = throttle((text: string) => marked(text), 100, {
  trailing: false,
  leading: true,
});

function NoteEditorPreview({ mdText, scrollPercent, onScroll }: Props) {
  const thisDiv = useRef<HTMLDivElement>(null);
  // console.log(activeID);
  useEffect(() => {
    if (thisDiv.current && scrollPercent) {
      thisDiv.current.scrollTo({
        top:
          (thisDiv.current.scrollHeight - thisDiv.current.clientHeight) *
          scrollPercent,
        behavior: "smooth",
      });
    }
  }, [scrollPercent]);

  return (
    <div className="bg-gray-700 w-full h-full relative">
      {mdText && (
        <div className="p-3 absolute h-full w-full">
          <div
            ref={thisDiv}
            className="rounded-2xl bg-gray-600 p-3 overflow-auto h-full w-full"
            // onScroll={(ev) => {
            //   const maxScroll =
            //     (ev.nativeEvent.target as HTMLTextAreaElement).scrollHeight -
            //     (ev.nativeEvent.target as HTMLTextAreaElement).clientHeight;
            //   const currentScroll = (ev.nativeEvent
            //     .target as HTMLTextAreaElement).scrollTop;

            //   if (currentScroll) {
            //     onScroll?.(currentScroll / maxScroll);
            //   } else {
            //     onScroll?.(0);
            //   }
            // }}
          >
            <div
              dangerouslySetInnerHTML={{ __html: render(mdText) ?? "" }}
              className="markdown-body"
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}

export { NoteEditorPreview as default };
