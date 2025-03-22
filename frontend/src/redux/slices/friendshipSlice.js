import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../apiClient";


const initialState = {
   myFriends: [],
   myPagination: {},
   userPagination: {},
   loading: false,
   error: ''
};

// --------------------- Async Reducer Functions ---------------------
// GET-FRIENDS: Fetch all friends of authenticated user (friendship with status accepted)
export const getFriends = createAsyncThunk('friendship/getFriends', async (params, thunkAPI) => {
   try {
      const response = await apiClient.get('friends', {
         params
      });
      return response.data;

   } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch friends");
   }
});

// GET-USER-FRIENDS: Fetch all friends of other users (friendship with status accepted)
export const getUserFriends = createAsyncThunk('friendship/getUserFriends', async (params, thunkAPI) => {
   try {
      const response = await apiClient.get('friends', {
         params
      });
      return response.data;

   } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch friends");
   }
});


export const FriendshipSlice = createSlice({
   name: 'friendship',
   initialState,
   reducers: {
      clearErrors: (state) => {
         state.error = '';
      }
   },
   extraReducers: (builder) => {
      builder
         // --------------------- get friends ---------------------
         .addCase(getFriends.pending, (state) => {
            state.loading = true;
         })
         .addCase(getFriends.fulfilled, (state, action) => {
            state.loading = false;
            state.myFriends = action.payload?.friends;
            state.myPagination = action.payload?.pagination;
            state.error = '';
         })
         .addCase(getFriends.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
         })

         // ------------------- get user friends -------------------
         .addCase(getUserFriends.pending, (state) => {
            state.loading = true;
         })
         .addCase(getUserFriends.fulfilled, (state, action) => {
            state.loading = false;
            state.userPagination = action.payload?.pagination;
            state.error = '';
         })
         .addCase(getUserFriends.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
         })
   }
});

export const { clearErrors } = FriendshipSlice.actions;
export default FriendshipSlice.reducer;