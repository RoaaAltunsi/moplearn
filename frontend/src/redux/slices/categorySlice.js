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
      return thunkAPI.rejectWithValue("Failed to fetch categories");
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
         .addCase(getCategories.fulfilled, (state, action) => {
            state.categories = action.payload;
            state.error = '';
         })
         .addCase(getCategories.rejected, (state, action) => {
            state.error = action.payload;
         })
   }
});

export const { clearErrors } = categorySlice.actions;
export default categorySlice.reducer;