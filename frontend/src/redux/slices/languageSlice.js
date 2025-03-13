import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../apiClient";

const initialState = {
   languages: [],
   loading: false,
   error: ''
};


// --------------------- Async Reducer Functions ---------------------
// GET-LANGUAGES: Fetch all course languages 
export const getLanguages = createAsyncThunk('language/get', async (_, thunkAPI) => {
   try {
      const response = await apiClient.get('languages');
      return response.data;

   } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch languages");
   }
});


export const languageSlice = createSlice({
   name: 'language',
   initialState,
   reducers: {
      clearErrors: (state) => {
         state.error = '';
      }
   },
   extraReducers: (builder) => {
      builder
         // --------------------- get course languages ---------------------
         .addCase(getLanguages.fulfilled, (state, action) => {
            state.languages = action.payload;
            state.error = '';
         })
         .addCase(getLanguages.rejected, (state, action) => {
            state.error = action.payload;
         })
   }
});

export const { clearErrors } = languageSlice.actions;
export default languageSlice.reducer;
