import {
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { RootState } from "..";
import { v4 as uuid } from "uuid";

type ID = string | number;

type BaseEntity = {
  id: ID;
};

type NamedEntity = BaseEntity & {
  name: string;
};

export type FileEntity = NamedEntity & {
  content: string;
};

export type FolderEntity = NamedEntity;

export type RelationEntity = {
  parentID: ID;
  childID: ID;
};

function isNamedEntity(
  x: FileEntity | NamedEntity | FolderEntity
): x is NamedEntity {
  return (
    (typeof (x as NamedEntity).id === "number" ||
      typeof (x as NamedEntity).id === "string") &&
    typeof (x as NamedEntity).name === "string"
  );
}

export function isFileEntity(x: FileEntity | NamedEntity): x is FileEntity {
  return typeof (x as FileEntity).content === "string" && isNamedEntity(x);
}

export function isFolderEntity(
  x: FileEntity | FolderEntity
): x is FolderEntity {
  return isNamedEntity(x);
}

export interface FileTreeState {
  tree: FolderEntity;
  status: "idle" | "loading" | "failed";
  activeFileID: string | number;
  openFileIDs: (string | number)[];
}

const fileAndFolderTable = createEntityAdapter<FolderEntity | FileEntity>();
const relationsTable = createEntityAdapter<RelationEntity>({
  selectId: (entity) => entity.childID,
});

interface InitialState {
  filesAndFolders: ReturnType<typeof fileAndFolderTable.getInitialState>;
  relations: ReturnType<typeof relationsTable.getInitialState>;
  activeFileID: ID;
  openFileIDs: ID[];
}

const rootEntity = { id: "root", name: "Root" };
const filesAndFoldersRootState = {
  entities: { root: rootEntity },
  ids: [rootEntity.id],
};

const initialState: InitialState = {
  // files and folders with root entity
  filesAndFolders: fileAndFolderTable.getInitialState(filesAndFoldersRootState),
  relations: relationsTable.getInitialState(),
  activeFileID: "",
  openFileIDs: [],
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
// export const incrementAsync = createAsyncThunk(
//   "fileTree/fetchCount",
//   async (amount: number) => {
//     const response = await fetchCount(amount);
//     // The value we return becomes the `fulfilled` action payload
//     return response.data;
//   }
// );

export const fileTableSlice = createSlice({
  name: "fileTable",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    renameNode(state, action: { payload: NamedEntity }) {
      const { id, name } = action.payload;
      fileAndFolderTable.updateOne(state.filesAndFolders, {
        id,
        changes: { name },
      });
    },

    updateFileContent(
      state,
      action: { payload: { id: string | number; content: string } }
    ) {
      const { id, content } = action.payload;
      fileAndFolderTable.updateOne(state.filesAndFolders, {
        id,
        changes: { content },
      });
    },

    deleteEntity(state, action: { payload: BaseEntity }) {
      const { id } = action.payload;

      fileAndFolderTable.removeOne(state.filesAndFolders, id);
      relationsTable.removeOne(state.relations, id);

      const gotIndex = state.openFileIDs.findIndex((item) => item === id);
      if (gotIndex > -1) {
        state.openFileIDs.splice(gotIndex, 1);
      }

      if (id === state.activeFileID) {
        state.activeFileID = state.openFileIDs[0] ?? "";
      }
      // console.log(`deleteNode from openFileIDs ${state.activeFileID}`);
    },

    createFile: {
      reducer(
        state,
        action: {
          payload: {
            name: string;
            inFolder: string | number;
            id: string;
            content: string;
          };
        }
      ) {
        // console.log("create file");

        const { id, name, inFolder, content } = action.payload;

        fileAndFolderTable.addOne(state.filesAndFolders, {
          id,
          content,
          name,
        });
        relationsTable.addOne(state.relations, {
          childID: id,
          parentID: inFolder,
        });
      },
      prepare(name: string, inFolder: string | number) {
        return {
          payload: { name, inFolder, id: uuid(), content: "" },
        };
      },
    },

    createFolder: {
      reducer(
        state,
        action: {
          payload: {
            name: string;
            inFolder: string | number;
            id: string | number;
          };
        }
      ) {
        // console.log("create folder");
        const { id, name, inFolder } = action.payload;

        fileAndFolderTable.addOne(state.filesAndFolders, {
          id,
          name: name,
        });
        relationsTable.addOne(state.relations, {
          childID: id,
          parentID: inFolder,
        });
      },
      prepare(name: string, inFolder: string | number) {
        return {
          payload: {
            name,
            inFolder,
            id: uuid(),
          },
        };
      },
    },

    setActiveFileID(state, action: { payload: string | number }) {
      state.activeFileID = action.payload;
    },

    openFile(state, action: { payload: { id: number | string } }) {
      const { id } = action.payload;
      // if fill isn't already opened
      if (state.openFileIDs.findIndex((item) => item === id) < 0) {
        const got = state.filesAndFolders.entities[id];

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

export const fileTableActions = fileTableSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectFileTable = (state: RootState) => state.fileTable;

export const selectFileTreeOpenFiles = (state: RootState) => {
  const files: FileEntity[] = [];
  for (const item of state.fileTable.openFileIDs) {
    const got = state.fileTable.filesAndFolders.entities[item];
    if (got) files.push(got as FileEntity);
  }
  return files;
};

export const selectFileTreeActiveFileID = (state: RootState) =>
  state.fileTable.activeFileID;

export const selectFileTreeActiveFile = (state: RootState) =>
  state.fileTable.filesAndFolders.entities[state.fileTable.activeFileID] as
    | FileEntity
    | undefined;

export const selectRelationsTable = (state: RootState) =>
  state.fileTable.relations;
export const selectFileAndFolderTable = (state: RootState) =>
  state.fileTable.filesAndFolders;

export const selectChildrenOfParent = createSelector(
  [
    selectRelationsTable,
    selectFileAndFolderTable,
    (state: RootState, parentID: ID) => parentID,
  ],
  (relations, filesAndFolders, parentID) => {
    const children: (FileEntity | FolderEntity)[] = [];
    for (const [, value] of Object.entries(relations.entities)) {
      // console.log(value);
      if (parentID === value?.parentID) {
        const got = filesAndFolders.entities[value.childID];
        if (got) {
          children.push(got);
          // console.log(got);
        }
      }
    }
    return children;
  }
);

export const selectEntity = (state: RootState, id: ID) =>
  state.fileTable.filesAndFolders.entities[id];

export const selectRoot = (state: RootState) =>
  state.fileTable.filesAndFolders.entities["root"];

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

export default fileTableSlice.reducer;
