import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../apiClient";

const initialState = {
   contributors: [],
   loading: false,
   error: ''
}


// --------------------- Async Reducer Functions --------------------- 
export const getContributors = createAsyncThunk('contributor/get', async (_,thunkAPI) => {
   try {
      const response = await apiClient.get('contributors');
      return response.data?.data;

   } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch contributors');
   }
});


const contributorSlice = createSlice({
   name: 'contributor',
   initialState,
   reducers: {
      clearErrors: (state) => {
         state.error = '';
      }
   },
   extraReducers: (builder) => {
      builder
      // --------------------- get contributors ---------------------
      .addCase(getContributors.fulfilled, (state, action) => {
         state.contributors = action.payload;
         state.error = '';
      })
      .addCase(getContributors.rejected, (state, action) => {
         state.error = action.payload;
      })
   }
});

export const { clearErrors } = contributorSlice.actions;
export default contributorSlice.reducer;