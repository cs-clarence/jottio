import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";
import { v4 as uuid } from "uuid";
import { fetchCount } from "./fileTreeAPI";

type BaseNode = {
  id: string | number;
};

export type Node = BaseNode & {
  name: string;
};
export type FileNode = Node & {
  content: string;
};
export type FolderNode = Node & {
  children: (FolderNode | FileNode)[];
};

function isNode(x: FileNode | Node | FolderNode): x is Node {
  return (
    (typeof (x as Node).id === "number" ||
      typeof (x as Node).id === "string") &&
    typeof (x as Node).name === "string"
  );
}

export function isFileNode(x: FileNode | Node): x is FileNode {
  return typeof (x as FileNode).content === "string" && isNode(x);
}

export function isFolderNode(x: FileNode | FolderNode | Node): x is FolderNode {
  return (x as FolderNode).children instanceof Array && isNode(x);
}

export interface FileTreeState {
  tree: FolderNode;
  status: "idle" | "loading" | "failed";
  activeFileID: string | number;
  openFileIDs: (string | number)[];
}

const initialState: FileTreeState = {
  tree: {
    id: uuid(),
    name: "Root",
    children: [
      {
        id: uuid(),
        name: "Folder 1",
        children: [
          { id: uuid(), name: "File 1", content: "# File 1" },
          { id: uuid(), name: "File 2", content: "# File 2" },
        ],
      },
      {
        id: uuid(),
        name: "Folder 2",
        children: [
          { id: uuid(), name: "File 3", content: "# File 3" },
          { id: uuid(), name: "File 4", content: "# File 4" },
        ],
      },
    ],
  },
  status: "idle",
  openFileIDs: [],
  activeFileID: "",
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const incrementAsync = createAsyncThunk(
  "fileTree/fetchCount",
  async (amount: number) => {
    const response = await fetchCount(amount);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

function findNode(
  tree: FolderNode,
  predicate: (item: FileNode | Node) => boolean
): FolderNode | FileNode | Node | null {
  const nodeStack: (Node | FileNode | FolderNode)[] = [tree];

  if (tree && tree.children) {
    while (!(nodeStack.length < 1)) {
      const got = nodeStack.pop();
      if (got) {
        if (predicate(got)) {
          return got;
        }
        if (isFolderNode(got)) {
          nodeStack.push(...got.children);
        }
      }
    }
  }
  return null;
}

function removeNode(
  rootNode: FolderNode,
  predicate: (item: FileNode | Node) => boolean
): void {
  for (const [index, node] of rootNode.children.entries()) {
    if (predicate(node)) {
      rootNode.children.splice(index, 1);
    }
  }
}

export const fileTreeSlice = createSlice({
  name: "counter",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    renameNode(state, action: { payload: Node }) {
      const got = findNode(state.tree, (item) => item.id === action.payload.id);
      if (got) {
        got.name = action.payload.name;
      }
    },

    updateFileContent(
      state,
      {
        payload: { id, content },
      }: { payload: { id: string | number; content: string } }
    ) {
      const got = findNode(state.tree, (i) => i.id === id);
      if (got && isFileNode(got)) {
        got.content = content;
      }
    },

    deleteNode(state, action: { payload: BaseNode }) {
      if (state.tree && state.tree.children) {
        removeNode(state.tree, (item) => item.id === action.payload.id);
      }
    },

    createFile(
      state,
      action: { payload: { name: string; inFolder: string | number } }
    ) {},

    createFolder(
      state,
      action: { payload: { name: string; inFolder: string | number } }
    ) {},

    setActiveFileID(state, action: { payload: string | number }) {
      state.activeFileID = action.payload;
    },

    openFile(state, action: { payload: { id: number | string } }) {
      if (
        state.openFileIDs.findIndex((item) => item === action.payload.id) < 0
      ) {
        const got = findNode(
          state.tree,
          (item) => item.id === action.payload.id
        );

        if (got) {
          state.openFileIDs.push(action.payload.id);
        }
      }
      state.activeFileID = action.payload.id;
    },

    closeFile(state, action: { payload: { id: number | string } }) {
      // find the index of the element with the id
      const index = state.openFileIDs.findIndex(
        (item) => item === action.payload.id
      );

      // remove the element from the array
      if (index > -1) {
        state.openFileIDs.splice(index, 1);
      }

      // if the closed file is the active one, find a new active file
      if (action.payload.id === state.activeFileID) {
        // only if the array isn't empty
        if (state.openFileIDs.length > 0) {
          state.activeFileID =
            state.openFileIDs[index === 0 ? index : index - 1];
        }
      }

      // if the array is empty, set the active index to nothing
      if (state.openFileIDs.length < 1) {
        state.activeFileID = "";
      }
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(incrementAsync.pending, (state) => {
  //       state.status = "loading";
  //     })
  //     .addCase(incrementAsync.fulfilled, (state, action) => {
  //       state.status = "idle";
  //       state.value += action.payload;
  //     });
  // },
});

export const fileTreeActions = fileTreeSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectFileTree = (state: RootState) => state.fileTree.tree;

export const selectFileTreeOpenFiles = (state: RootState) => {
  const files: FileNode[] = [];
  for (const item of state.fileTree.openFileIDs) {
    const got = findNode(state.fileTree.tree, (el) => el.id === item);
    if (got) files.push(got as FileNode);
  }
  return files;
};

export const selectFileTreeActiveFileID = (state: RootState) =>
  state.fileTree.activeFileID;

export const selectFileTreeActiveFile = (state: RootState) =>
  findNode(
    state.fileTree.tree,
    (item) => item.id === state.fileTree.activeFileID
  ) as FileNode;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
// export const incrementIfOdd = (amount: number): AppThunk => (
//   dispatch,
//   getState
// ) => {
//   const currentValue = selectCount(getState());
//   if (currentValue % 2 === 1) {
//     dispatch(incrementByAmount(amount));
//   }
// };

export default fileTreeSlice.reducer;
