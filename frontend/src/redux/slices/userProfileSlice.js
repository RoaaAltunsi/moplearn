import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../apiClient";
import { updateAuthUser } from "./authSlice";

const initialState = {
   loading: false,
   validationErrors: {},
   error: ''
};


// --------------------- Async Reducer Functions ---------------------
// UPDATE-PROFILE: Update profile info
export const updateProfile = createAsyncThunk('userProfile/update', async (data, thunkAPI) => {
   try {
      const response = await apiClient.post('profile', data);
      thunkAPI.dispatch(updateAuthUser(response.data?.user));
      return response.data;

   } catch (error) {
      if (error.response?.status === 422) {
         // Validation errors returned with status = 422
         return thunkAPI.rejectWithValue({
            validationErrors: error.response.data?.errors
         })
      }
      // General errors
      return thunkAPI.rejectWithValue({
         error: error.response?.data?.message || 'Failed to update profile'
      })
   }
});


export const userProfileSlice = createSlice({
   name: 'userProfile',
   initialState,
   reducers: {
      clearErrors: (state) => {
         state.error = '';
      }
   },
   extraReducers: (builder) => {
      builder
         // ------------------ update user profile ------------------
         .addCase(updateProfile.pending, (state) => {
            state.loading = true;
         })
         .addCase(updateProfile.fulfilled, (state) => {
            state.loading = false;
            state.validationErrors = {};
            state.error = '';
         })
         .addCase(updateProfile.rejected, (state, action) => {
            state.loading = false;
            state.validationErrors = action.payload?.validationErrors || {};
            state.error = action.payload?.error || '';
         })
   }
});

export const { clearErrors } = userProfileSlice.actions;
export default userProfileSlice.reducer;