import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../apiClient";

const initialState = {
   loading: false,
   validationErrors: {},
   error: ''
};


// --------------------- Async Reducer Functions --------------------- 
// SUBMIT-FORM: create new contribution form
export const submitForm = createAsyncThunk('contributionForm/submit', async (data, thunkAPI) => {
   try {
      const response = await apiClient.post('contribution-forms', data);
      return response.data;

   } catch (error) {
      if (error.response?.status === 422) {
         return thunkAPI.rejectWithValue({
            validationErrors: error.response.data?.errors
         });
      }
      // General errors
      return thunkAPI.rejectWithValue({
         error: error.response?.data?.message || 'Failed to create contribution form'
      });
   }
});


const contributionFormSlice = createSlice({
   name: 'contributionForm',
   initialState,
   reducers: {
      clearErrors: (state) => {
         state.error = '';
      }
   },
   extraReducers: (builder) => {
      builder
         // --------------------- submit form ---------------------
         .addCase(submitForm.pending, (state) => {
            state.loading = true;
         })
         .addCase(submitForm.fulfilled, (state) => {
            state.loading = false;
            state.validationErrors = {};
            state.error = '';
         })
         .addCase(submitForm.rejected, (state, action) => {
            state.loading = false;
            state.validationErrors = action.payload?.validationErrors || {};
            state.error = action.payload?.error || '';
         })
   }
});

export const { clearErrors } = contributionFormSlice.actions;
export default contributionFormSlice.reducer;