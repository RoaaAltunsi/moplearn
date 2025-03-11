import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../apiClient";


const initialState = {
   users: [],
   loading: false,
   error: ''
};


// --------------------- Async Reducer Functions ---------------------
// GET-USERS: Fetch all users
export const getUsers = createAsyncThunk('user/get', async (_, thunkAPI) => {
   try {
      const response = await apiClient.get('users');
      return response.data;

   } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch users");
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
            state.users = action.payload;
            state.error = '';
         })
         .addCase(getUsers.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
         })
   }
});

export const { clearErrors } = userSlice.actions;
export default userSlice.reducer;