import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// -------------------- Root Persist Config --------------------
const rootPersistConfig = {
   key: 'root',
   storage,
   blacklist: ['auth'] // Prevent entire auth slice from being persisted globally
};

// ----- Auth Persist Config (Persist only necessary data) -----
const authPersistConfig = {
   key: 'auth',
   storage,
   whitelist: ['user', 'isAuthenticated'] // Persist only user data
};

// ------------- Wrap Reducers with PersistReducer -------------
const rootReducer = combineReducers({
   auth: persistReducer(authPersistConfig, authSlice),
});

// ----------------- Apply Persisted Reducer -------------------
const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

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