import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import fileTreeReducer from "./fileTree/fileTreeSlice";

function saveToLocalStorage(o: object) {
  try {
    const jsonState = JSON.stringify(o);
    localStorage.setItem("jottio/reduxState", jsonState);
  } catch (e) {
    console.log(e);
  }
}

function loadFromLocalStorage() {
  try {
    const got = localStorage.getItem("jottio/reduxState");
    const jsState = JSON.parse(got ?? "{}");
    return jsState;
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

export const store = configureStore({
  reducer: {
    fileTree: fileTreeReducer,
  },
  preloadedState: loadFromLocalStorage(),
});

store.subscribe(() => saveToLocalStorage(store.getState()));

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
export { fileTreeReducer };
