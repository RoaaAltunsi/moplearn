import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../apiClient";
import { logout, updateAuthUser } from "./authSlice";


const initialState = {
   users: [],
   pagination: {},
   loading: false,
   validationErrors: {},
   error: ''
};


// --------------------- Async Reducer Functions ---------------------
// GET-USERS: Fetch all users
export const getUsers = createAsyncThunk('user/get', async (params, thunkAPI) => {
   try {
      const response = await apiClient.get('users', {
         params
      });
      return response.data;

   } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch users");
   }
});

// UPDATE-PROFILE: Update profile info
export const updateProfile = createAsyncThunk('user/updateProfile', async (data, thunkAPI) => {
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

// UPDATE-ACCOUNT: update user account info
export const updateAccount = createAsyncThunk('user/updateAccount', async (data, thunkAPI) => {
   try {
      const response = await apiClient.put('account', data);
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
         error: error.response?.data?.message || 'Failed to update account'
      })
   }
});

// DELETE-ACCOUNT: Delete user account
export const deleteAccount = createAsyncThunk('user/deleteAccount', async (password, thunkAPI) => {
   try {
      const response = await apiClient.delete('account', {
         data: { password }
      });
      thunkAPI.dispatch(logout());
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
         error: error.response?.data?.message || 'Failed to delete account'
      })
   }
});


export const userSlice = createSlice({
   name: 'user',
   initialState,
   reducers: {
      clearErrors: (state) => {
         state.error = '';
      }
   },
   extraReducers: (builder) => {
      builder
         // --------------------- get all users ---------------------
         .addCase(getUsers.pending, (state) => {
            state.loading = true;
         })
         .addCase(getUsers.fulfilled, (state, action) => {
            state.loading = false;
            state.users = action.payload?.users;
            state.pagination = action.payload?.pagination;
            state.error = '';
         })
         .addCase(getUsers.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
         })

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

         // ------------------ update user account ------------------
         .addCase(updateAccount.pending, (state) => {
            state.loading = true;
         })
         .addCase(updateAccount.fulfilled, (state, action) => {
            state.loading = false;
            state.validationErrors = {};
            state.error = '';
         })
         .addCase(updateAccount.rejected, (state, action) => {
            state.loading = false;
            state.validationErrors = action.payload?.validationErrors || {};
            state.error = action.payload?.error || '';
         })

         // ------------------ delete user account ------------------
         .addCase(deleteAccount.pending, (state) => {
            state.loading = true;
         })
         .addCase(deleteAccount.fulfilled, (state) => {
            state.loading = false;
            state.validationErrors = {};
            state.error = '';
         })
         .addCase(deleteAccount.rejected, (state, action) => {
            state.loading = false;
            state.validationErrors = action.payload?.validationErrors || {};
            state.error = action.payload?.error || '';
         })
   }
});

export const { clearErrors } = userSlice.actions;
export default userSlice.reducer;