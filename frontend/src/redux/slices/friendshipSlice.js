import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../apiClient";


const initialState = {
   myFriends: [],
   myPagination: {},
   userPagination: {},
   receivedRequests: [],
   receivedPagination: {},
   sentRequests: [],
   sentPagination: {},
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

// GET-RECEIVED-REQUESTS: Fetch all pending requests received from other users
export const getReceivedRequests = createAsyncThunk('friendship/getReceivedRequests', async (_, thunkAPI) => {
   try {
      const response = await apiClient.get('friends/requests/received');
      return response.data;

   } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch received friendship requests");
   }
});

// GET-SENT-REQUESTS: Fetch all pending requests sent by the user
export const getSentRequests = createAsyncThunk('friendship/getSentRequests', async (_, thunkAPI) => {
   try {
      const response = await apiClient.get('friends/requests/sent');
      return response.data;

   } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch sent friendship requests");
   }
});

// UPDATE-STATUS: Update friendship status
export const updateStatus = createAsyncThunk('friendship/updateStatus', async ({ id, newStatus }, thunkAPI) => {
   try {
      await apiClient.patch(`friends/${id}/status`, {
         newStatus
      });
      if (newStatus === 'accepted') {
         thunkAPI.dispatch(getReceivedRequests());
         thunkAPI.dispatch(getFriends());
      }

   } catch (error) {
      return thunkAPI.rejectWithValue("Failed to update friendship status");
   }
});

// DELETE-FRIENDSHIP: Delete specific friendship
export const deleteFriendship = createAsyncThunk('friendship/delete', async ({ id, status }, thunkAPI) => {
   try {
      await apiClient.delete(`friends/${id}`);
      if (status === 'accepted') {
         thunkAPI.dispatch(getFriends());
      } else {
         thunkAPI.dispatch(getReceivedRequests());
         thunkAPI.dispatch(getSentRequests());
      }

   } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to delete friendship");
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

         // ---------------- get received requests -----------------
         .addCase(getReceivedRequests.pending, (state) => {
            state.pending = true;
         })
         .addCase(getReceivedRequests.fulfilled, (state, action) => {
            state.loading = false;
            state.receivedRequests = action.payload?.requests;
            state.receivedPagination = action.payload?.pagination;
            state.error = '';
         })
         .addCase(getReceivedRequests.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
         })

         // ------------------ get sent requests -------------------
         .addCase(getSentRequests.pending, (state) => {
            state.pending = true;
         })
         .addCase(getSentRequests.fulfilled, (state, action) => {
            state.loading = false;
            state.sentRequests = action.payload?.requests;
            state.sentPagination = action.payload?.pagination;
            state.error = '';
         })
         .addCase(getSentRequests.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
         })

         // -------------- update friendship status ----------------
         .addCase(updateStatus.pending, (state) => {
            state.loading = true;
         })
         .addCase(updateStatus.fulfilled, (state) => {
            state.loading = false;
            state.error = '';
         })
         .addCase(updateStatus.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
         })
   }
});

export const { clearErrors } = FriendshipSlice.actions;
export default FriendshipSlice.reducer;