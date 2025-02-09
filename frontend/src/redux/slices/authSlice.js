import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../apiClient";

const initialState = {
   user: {},
   token: null,
   validationErrors: {},
   loading: false,
   error: ''
};


// --------------------- Async Reducer Functions --------------------- 
// ADD USER: register new user
export const addUser = createAsyncThunk('auth/addUser', async (userData, thunkAPI) => {
   try {
      const response = await apiClient.post('users', userData);
      return response.data;

   } catch (error) {
      if (error.response && error.response.status == 422) {
         // Validation errors returned with status = 422
         return thunkAPI.rejectWithValue({
            validationErrors: error.response.data?.errors
         })
      }
      // General errors
      return thunkAPI.rejectWithValue({
         error: error.response?.data?.error || error.response?.data.message
      })
   }
});


const authSlice = createSlice({
   name: 'auth',
   initialState,
   reducers: {},
   extraReducers: (builder) => {
      builder
      // --------------------- addUser ---------------------
         .addCase(addUser.pending, (state) => {
            state.loading = true;
         })

         .addCase(addUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload?.user;
            state.token = action.payload?.token;
            if (action.payload?.token) {
               localStorage.setItem('token', state.token);
            }
            state.validationErrors = {};
            state.error = '';
         })
         
         .addCase(addUser.rejected, (state, action) => {
            state.loading = false;
            state.validationErrors = action.payload?.validationErrors || {};
            state.error = action.payload?.error || '';
         });
   }
});

// export const { addUser } = authSlice.actions;
export default authSlice.reducer;