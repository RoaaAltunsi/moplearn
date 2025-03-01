import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authSlice from "./slices/authSlice";
import contributionFormSlice from "./slices/contributionFormSlice";


// -------------------- Root Persist Config --------------------
const rootPersistConfig = {
   key: 'root',
   storage,
   blacklist: [ // Prevent entire auth slice from being persisted globally
      'auth',
      'contributionForm'
   ]
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
   contributionForm: contributionFormSlice
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