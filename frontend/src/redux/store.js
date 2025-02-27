import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// ---------- Persist Configurations for Each Reducer ----------
const authPersistConfig = {
   key: 'auth',
   storage,
   whitelist: ['user'] // the persist states
};

// ------------- Wrap Reducers with PersistReducer -------------
const rootReducer = combineReducers({
   auth: persistReducer(authPersistConfig, authSlice),
});

// ----------------- Create Persisted Reducer ------------------
const persistedReducer = persistReducer(
   { key: 'root', storage }, // Root config, blacklist unnecessary
   rootReducer
);

// ---------------------- Configure Store ----------------------
export const store = configureStore({
   reducer: persistedReducer,
   middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
         serializableCheck: false, // Avoid serializability warnings
      }),
});

// -------------------- Create persistor -----------------------
export const persistor = persistStore(store);