import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../apiClient";


const initialState = {
   categories: [],
   loading: false,
   error: ''
};

// --------------------- Async Reducer Functions ---------------------
export const getCategories = createAsyncThunk('category/get', async (_, thunkAPI) => {
   try {
      const response = await apiClient.get('categories');
      return response.data;

   } catch (error) {
      thunkAPI.rejectWithValue("Failed to fetch categories");
   }
});


export const categorySlice = createSlice({
   name: 'category',
   initialState,
   reducers: {
      clearErrors: (state) => {
         state.error = '';
      }
   },
   extraReducers: (builder) => {
      builder
         // --------------------- get categories ---------------------
         .addCase(getCategories.pending, (state) => {
            state.loading = true;
         })
         .addCase(getCategories.fulfilled, (state, action) => {
            state.loading = false;
            state.categories = action.payload;
            state.error = '';
         })
         .addCase(getCategories.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
         })
   }
});

export const { clearErrors } = categorySlice.actions;
export default categorySlice.reducer;