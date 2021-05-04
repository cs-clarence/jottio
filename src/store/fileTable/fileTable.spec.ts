import counterReducer, {
  FileTreeState,
  fileTableActions,
} from "./fileTableSlice";

describe("counter reducer", () => {
  const initialState: FileTreeState = {
    tree: {
      id: 0,
      name: "Root",
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

  it("should handle increment", () => {});
});
