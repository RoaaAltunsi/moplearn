import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../apiClient";
import axios from "axios";

const initialState = {
   user: {},
   validationErrors: {},
   isAuthenticated: false,
   loading: false,
   error: ''
};


// --------------------- Async Reducer Functions --------------------- 
// REGISTER: register new user
export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
   try {
      await axios.get('/sanctum/csrf-cookie');
      const response = await apiClient.post('register', userData);
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
         error: error.response?.data?.message || 'Register Failed'
      })
   }
});

// LOGIN: authenticate user
export const login = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
   try {
      await axios.get('/sanctum/csrf-cookie');
      const response = await apiClient.post('login', credentials);
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
         error: error.response?.data?.message || 'Log in Failed'
      })
   }
});

// CHECK-AUTH-STATUS: Check authentication by fetching authenticated user
export const checkAuthStatus = createAsyncThunk('auth/check', async (_, thunkAPI) => {
   try {
      const response = await apiClient.get('/user');
      return response.data;
   } catch (error) {
      if (error.response?.status === 401) {
         // Session expired or not logged in
         return thunkAPI.rejectWithValue({ expired: true, error: "Session expired. Please log in again" });
      }
      return thunkAPI.rejectWithValue("Something went wrong");
   }
});

// LOGOUT: logout user from the system
export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
   try {
      await apiClient.post('logout');
   } catch (error) {
      return thunkAPI.rejectWithValue('Logout Failed');
   }
});

// VALIDATE-EMAIL: validate user's email
export const validateEmail = createAsyncThunk('auth/validateEmail', async (email, thunkAPI) => {
   try {
      await apiClient.post('email/validation', email);
   } catch (error) {
      if (error.response?.status === 422) {
         // Validation errors returned with status = 422
         return thunkAPI.rejectWithValue({
            validationErrors: error.response.data?.errors
         })
      }
      // General errors
      return thunkAPI.rejectWithValue({
         error: error.response?.data?.message || 'Validation Failed'
      })
   }
});

// RESET-PASSWORD: reset user's password
export const resetPassword = createAsyncThunk('auth/resetPassword', async (data, thunkAPI) => {
   try {
      await apiClient.post('password/reset', data);
   } catch (error) {
      if (error.response?.status === 422) {
         // Validation errors returned with status = 422
         return thunkAPI.rejectWithValue({
            validationErrors: error.response.data?.errors
         })
      }
      // General errors
      return thunkAPI.rejectWithValue({
         error: error.response?.data?.message || 'Reset Password Failed'
      })
   }
})


const authSlice = createSlice({
   name: 'auth',
   initialState,
   reducers: {
      clearErrors: (state) => {
         state.error = '';
         state.validationErrors = {};
      },
      updateAuthUser: (state, action) => {
         state.user = { ...state.user, ...action.payload };
      }
   },
   extraReducers: (builder) => {
      builder
         // --------------------- register ---------------------
         .addCase(register.pending, (state) => {
            state.loading = true;
         })
         .addCase(register.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload?.user;
            state.isAuthenticated = true;
            state.validationErrors = {};
            state.error = '';
         })
         .addCase(register.rejected, (state, action) => {
            state.loading = false;
            state.validationErrors = action.payload?.validationErrors || {};
            state.error = action.payload?.error || '';
         })

         // --------------------- login ----------------------
         .addCase(login.pending, (state) => {
            state.loading = true;
         })
         .addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload?.user;
            state.isAuthenticated = true;
            state.validationErrors = {};
            state.error = '';
         })
         .addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.validationErrors = action.payload?.validationErrors || {};
            state.error = action.payload?.error || '';
         })

         // --------------- check auth status ----------------
         .addCase(checkAuthStatus.rejected, (state, action) => {
            if (action.payload?.expired) {
               state.isAuthenticated = false;
               state.user = {};
               state.error = action.payload?.error;
            }
         })

         // --------------------- logout ---------------------
         .addCase(logout.pending, (state) => {
            state.loading = true;
         })
         .addCase(logout.fulfilled, (state) => {
            state.loading = false;
            state.user = {};
            state.isAuthenticated = false;
            state.validationErrors = {};
            state.error = '';
         })
         .addCase(logout.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || '';
         })

         // ----------------- validate email ------------------
         .addCase(validateEmail.pending, (state) => {
            state.loading = true;
         })
         .addCase(validateEmail.fulfilled, (state) => {
            state.loading = false;
            state.validationErrors = {};
            state.error = '';
         })
         .addCase(validateEmail.rejected, (state, action) => {
            state.loading = false;
            state.validationErrors = action.payload?.validationErrors || {};
            state.error = action.payload?.error || '';
         })

         // ----------------- reset password ------------------
         .addCase(resetPassword.pending, (state) => {
            state.loading = true;
         })
         .addCase(resetPassword.fulfilled, (state) => {
            state.loading = false;
            state.validationErrors = {};
            state.error = '';
         })
         .addCase(resetPassword.rejected, (state, action) => {
            state.loading = false;
            state.validationErrors = action.payload?.validationErrors || {};
            state.error = action.payload?.error || '';
         })
   }
});

export const { clearErrors, updateAuthUser } = authSlice.actions;
export default authSlice.reducer;