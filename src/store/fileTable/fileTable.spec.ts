import counterReducer, {
  FileTreeState,
  fileTreeActions,
} from "./fileTableSlice";

describe("counter reducer", () => {
  const initialState: FileTreeState = {
    tree: {
      id: 0,
      name: "Root",
      children: [
        {
          id: 1,
          name: "Folder 1",
          children: [
            { id: 2, name: "File 1", content: "# File 1" },
            { id: 3, name: "File 2", content: "# File 2" },
          ],
        },
        {
          id: 4,
          name: "Folder 2",
          children: [
            { id: 5, name: "File 3", content: "# File 3" },
            { id: 5, name: "File 4", content: "# File 4" },
          ],
        },
      ],
    },
    status: "idle",
    openFileIDs: [],
    activeFileID: 0,
  };
  it("should handle initial state", () => {
    expect(counterReducer(undefined, { type: "unknown" })).toEqual({
      value: 0,
      status: "idle",
    });
  });

  it("should handle increment", () => {
    const actual = counterReducer(
      initialState,
      fileTreeActions.createFile({ inFolder: 0, name: "Folder 20" })
    );
    expect(actual.tree).toEqual(4);
  });
});
