// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import snackBarReducer from "./snackBarSlice";
import userReducer from "./userSlice";
import storage from "redux-persist/lib/storage";
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";
import { combineReducers } from "redux";
// Configuration for redux-persist
const persistConfig = {
    key: "root",
    storage,
};

// Combine all your individual slice reducers into a single root reducer
const rootReducer = combineReducers({
    user: userReducer,
    snackBar: snackBarReducer,
});

// Create a persisted reducer by wrapping your rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the Redux store using configureStore from Redux Toolkit
export const store = configureStore({
    // Use the persisted reducer as the main reducer for the store
    reducer: persistedReducer,
    // Customize middleware to ignore redux-persist action types during serializable checks
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // These action types are dispatched by redux-persist and are intentionally non-serializable
                // Ignoring them prevents console warnings/errors

                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }),
});

// Create a persistor object, which is used to delay the rendering of your app's UI
// until your persisted state has been retrieved and saved to Redux.
export const persistor = persistStore(store);
