import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import fileTreeReducer from "./fileTree/fileTreeSlice";
import noteEditorReducer from "./noteEditor/noteEditorSlice";

export const store = configureStore({
  reducer: {
    fileTree: fileTreeReducer,
    noteEditor: noteEditorReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
// forward exports from fileTreeSlice
export * from "./fileTree/fileTreeSlice";
export * from "./noteEditor/noteEditorSlice";
export { fileTreeReducer, noteEditorReducer };
