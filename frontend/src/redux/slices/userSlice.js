import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../apiClient";
import { logout, updateAuthUser } from "./authSlice";


const initialState = {
   users: [], // summary users (used in partner card)
   fullUsers: {}, // to display complete user info in profile
   userCourseIds: [],
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

// GET-USER-BY-USERNAME: Fetch the user object by username
export const getUserByUsername = createAsyncThunk('user/getByUsername', async (username, thunkAPI) => {
   try {
      const response = await apiClient.get(`users/username/${username}`);
      return response.data;

   } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch user");
   }
});

// UPDATE-ACCOUNT: update user account info
export const updateAccount = createAsyncThunk('user/updateAccount', async (data, thunkAPI) => {
   try {
      const response = await apiClient.put('account', data);
      thunkAPI.dispatch(updateAuthUser(response.data?.user));

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
      await apiClient.delete('account', {
         data: { password }
      });
      thunkAPI.dispatch(logout());

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

// GET-USER-COURSES: Fetch registered courses for this user
export const getUserCourses = createAsyncThunk('user/courses', async (user_id, thunkAPI) => {
   try {
      const response = await apiClient.get(`users/${user_id}/courses`);
      return response.data;
      
   } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch user courses");
   }
});


export const userSlice = createSlice({
   name: 'user',
   initialState,
   reducers: {
      clearErrors: (state) => {
         state.error = '';
         state.validationErrors = {};
      },
      resetUsers: (state) => {
         state.users = [];
         state.pagination = {};
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

         // ----------------- get user by username ------------------
         .addCase(getUserByUsername.pending, (state) => {
            state.loading = true;
         })
         .addCase(getUserByUsername.fulfilled, (state, action) => {
            const user = action.payload;
            state.loading = false;
            state.fullUsers[user.username] = user;
            state.error = '';
         })
         .addCase(getUserByUsername.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
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

         // ------------------- get user courses --------------------
         .addCase(getUserCourses.pending, (state) => {
            state.loading = true;
         })
         .addCase(getUserCourses.fulfilled, (state, action) => {
            state.loading = false;
            state.userCourseIds = action.payload;
            state.error = '';
         })
         .addCase(getUserCourses.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
         })
   }
});

export const { clearErrors, resetUsers } = userSlice.actions;
export default userSlice.reducer;