import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../apiClient";


const initialState = {
   myFriends: [],
   friendsPagination: {}, // pagination for authenticated user friends
   friendReqSummaries: [],
   receivedRequests: [],
   receivedPagination: {},
   receivedReqSummaries: [],
   sentRequests: [],
   sentPagination: {},
   sentRequestsSummaries: [],
   loading: false,
   error: ''
};

// --------------------- Async Reducer Functions ---------------------
// GET-FRIENDS: Fetch paginated friends of authenticated user (friendship with status accepted)
export const getFriends = createAsyncThunk('friendship/getFriends', async ({ user_id, page = 1, size = 9 }, thunkAPI) => {
   try {
      const response = await apiClient.get(`users/${user_id}/friends`, {
         params: { page, size }
      });
      return response.data;

   } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch friends");
   }
});

// GET-FRIEND-SUMMARIES: Fetch all summaries of friends for the authenticatd user
export const getFriendsSummaries = createAsyncThunk('friendship/getFriendsSummaries', async (user_id, thunkAPI) => {
   try {
      const response = await apiClient.get(`users/${user_id}/friends-summary`);
      return response.data;

   } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch friend summaries");
   }
});

// GET-USER-FRIENDS: Fetch paginated friends of other users (friendship with status accepted)
export const getUserFriends = createAsyncThunk('friendship/getUserFriends', async ({ user_id, page = 1, size = 9 }, thunkAPI) => {
   try {
      await apiClient.get(`users/${user_id}/friends`, {
         params: { page, size }
      });

   } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch friends");
   }
});

// GET-RECEIVED-REQUESTS: Fetch paginated received requests for the authenticated user
export const getReceivedRequests = createAsyncThunk('friendship/getReceivedRequests', async (_, thunkAPI) => {
   try {
      const response = await apiClient.get('friends/requests/received');
      return response.data;

   } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch received friendship requests");
   }
});

// GET-RECEIVED-REQUEST-SUMMARIES: Fetch all summaries of received requests for the authenticatd user
export const getReceivedRequestSummaries = createAsyncThunk('friendship/getReceivedRequestSummaries', async (_, thunkAPI) => {
   try {
      const response = await apiClient.get('friends/requests-summary/received');
      return response.data;

   } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch received request summaries");
   }
});

// GET-SENT-REQUESTS: Fetch paginated sent requests for the authenticated user
export const getSentRequests = createAsyncThunk('friendship/getSentRequests', async (_, thunkAPI) => {
   try {
      const response = await apiClient.get('friends/requests/sent');
      return response.data;

   } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch sent friendship requests");
   }
});

// GET-SENT-REQUEST-SUMMARIES: Fetch all summaries of sent requests for the authenticatd user
export const getSentRequestSummaries = createAsyncThunk('friendship/getSentRequestSummaries', async (_, thunkAPI) => {
   try {
      const response = await apiClient.get('friends/requests-summary/sent');
      return response.data;

   } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch received request summaries");
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
         thunkAPI.dispatch(getFriendsSummaries());
      } else if (status === 'received') {
         thunkAPI.dispatch(getReceivedRequests());
         thunkAPI.dispatch(getReceivedRequestSummaries());
      } else {
         thunkAPI.dispatch(getSentRequests());
         thunkAPI.dispatch(getSentRequestSummaries());
      }

   } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to delete friendship");
   }
});

// CREATE-FRIENDSHIP: Create new friendship request
export const createFriendship = createAsyncThunk('friendship/create', async ({ receiver_id }, thunkAPI) => {
   try {
      await apiClient.post('friends', { receiver_id });
      thunkAPI.dispatch(getSentRequests());
      thunkAPI.dispatch(getSentRequestSummaries());

   } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to send friendship request");
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
            state.friendsPagination = action.payload?.pagination;
            state.error = '';
         })
         .addCase(getFriends.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
         })

         // --------------- get friends summaries -----------------
         .addCase(getFriendsSummaries.pending, (state) => {
            state.loading = true;
         })
         .addCase(getFriendsSummaries.fulfilled, (state, action) => {
            state.loading = false;
            state.friendReqSummaries = action.payload;
            state.error = '';
         })
         .addCase(getFriendsSummaries.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
         })

         // ------------------- get user friends -------------------
         .addCase(getUserFriends.pending, (state) => {
            state.loading = true;
         })
         .addCase(getUserFriends.fulfilled, (state, action) => {
            state.loading = false;
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

         // ----------- get received requests summaries -------------
         .addCase(getReceivedRequestSummaries.pending, (state) => {
            state.pending = true;
         })
         .addCase(getReceivedRequestSummaries.fulfilled, (state, action) => {
            state.loading = false;
            state.receivedReqSummaries = action.payload;
            state.error = '';
         })
         .addCase(getReceivedRequestSummaries.rejected, (state, action) => {
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

         // ------------ get sent requests summaries ----------------
         .addCase(getSentRequestSummaries.pending, (state) => {
            state.pending = true;
         })
         .addCase(getSentRequestSummaries.fulfilled, (state, action) => {
            state.loading = false;
            state.sentRequestsSummaries = action.payload;
            state.error = '';
         })
         .addCase(getSentRequestSummaries.rejected, (state, action) => {
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

         // ------------- create friendship request ----------------
         .addCase(createFriendship.pending, (state) => {
            state.loading = true;
         })
         .addCase(createFriendship.fulfilled, (state) => {
            state.loading = false;
            state.error = '';
         })
         .addCase(createFriendship.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
         })
   }
});

export const { clearErrors } = FriendshipSlice.actions;
export default FriendshipSlice.reducer;