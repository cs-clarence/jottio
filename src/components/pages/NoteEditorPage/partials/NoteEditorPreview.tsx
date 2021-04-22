import MarkdownIt from "markdown-it";
import { debounce } from "lodash";
import "./NoteEditorPreview.scss";

type Props = { mdText: string };

const md = new MarkdownIt();
const render = debounce((text: string) => md.render(text), 100, {
  trailing: true,
  leading: true,
});

function NoteEditorPreview({ mdText }: Props) {
  return (
    <div className="bg-gray-700 w-full h-full markdown-body relative">
      {mdText && (
        <div className="p-3 absolute h-full w-full">
          <div className="rounded-2xl bg-gray-600 p-3 overflow-auto h-full w-full">
            <div
              dangerouslySetInnerHTML={{ __html: render(mdText) ?? "" }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}

export { NoteEditorPreview as default };
