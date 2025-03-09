import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authSlice from "./slices/authSlice";
import contributionFormSlice from "./slices/contributionFormSlice";
import contributorSlice from "./slices/contributorSlice";
import courseSlice from "./slices/courseSlice";
import categorySlice from "./slices/categorySlice";


// -------------------- Root Persist Config --------------------
const rootPersistConfig = {
   key: 'root',
   storage,
   blacklist: [ // Prevent entire auth slice from being persisted globally
      'auth',
      'contributionForm',
      'contributor',
      'course',
      'category'
   ]
};

// ------- Persist Config (Persist only necessary data) --------
const authPersistConfig = {
   key: 'auth',
   storage,
   whitelist: ['user', 'isAuthenticated'] // Persist only user data
};
const categoryPersistConfig = {
   key: 'category',
   storage,
   whitelist: ['categories']
};

// ------------- Wrap Reducers with PersistReducer -------------
const rootReducer = combineReducers({
   auth: persistReducer(authPersistConfig, authSlice),
   contributionForm: contributionFormSlice,
   contributor: contributorSlice,
   course: courseSlice,
   category: persistReducer(categoryPersistConfig, categorySlice)
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