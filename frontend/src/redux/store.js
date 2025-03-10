import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authSlice from "./slices/authSlice";
import contributionFormSlice from "./slices/contributionFormSlice";
import contributorSlice from "./slices/contributorSlice";
import courseSlice from "./slices/courseSlice";
import categorySlice from "./slices/categorySlice";
import languageSlice from "./slices/languageSlice";
import topicSlice from "./slices/topicSlice";


// -------------------- Root Persist Config --------------------
const rootPersistConfig = {
   key: 'root',
   storage,
   blacklist: [ // Prevent entire auth slice from being persisted globally
      'auth',
      'contributionForm',
      'contributor',
      'course',
      'category',
      'language',
      'topic'
   ]
};

// ------- Persist Config (Persist only necessary data) --------
const authPersistConfig = {
   key: 'auth',
   storage,
   whitelist: ['user', 'isAuthenticated'] // Persist only user data
};
const contributorPersistConfig = {
   key: 'contributor',
   storage,
   whitelist: ['contributors']
};
const categoryPersistConfig = {
   key: 'category',
   storage,
   whitelist: ['categories']
};
const languagePersistConfig = {
   key: 'language',
   storage,
   whitelist: ['languages']
};

// ------------- Wrap Reducers with PersistReducer -------------
const rootReducer = combineReducers({
   auth: persistReducer(authPersistConfig, authSlice),
   contributionForm: contributionFormSlice,
   contributor: persistReducer(contributorPersistConfig, contributorSlice),
   course: courseSlice,
   category: persistReducer(categoryPersistConfig, categorySlice),
   language: persistReducer(languagePersistConfig, languageSlice),
   topic: topicSlice
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