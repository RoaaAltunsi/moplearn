import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../apiClient";

const initialState = {
   topics: [],
   loading: false,
   error: ''
};

// --------------------- Async Reducer Functions ---------------------
// GET-TOPICS: Fetch all topics under specific category
export const getTopics = createAsyncThunk('topic/get', async (categoryId, thinkAPI) => {
   try {
      const response = await apiClient.get(`categories/${categoryId}/topics`);
      return response.data;

   } catch (error) {
      return thinkAPI.rejectWithValue("Failed to fetch topics");
   }
});


export const topicSlice = createSlice({
   name: 'topic',
   initialState,
   reducers: {
      clearErrors: (state) => {
         state.error = '';
      }
   },
   extraReducers: (builder) => {
      builder
         // --------------------- get category topics ---------------------
         .addCase(getTopics.pending, (state) => {
            state.loading = true;
         })
         .addCase(getTopics.fulfilled, (state, action) => {
            state.loading = false;
            state.topics = action.payload;
            state.error = '';
         })
         .addCase(getTopics.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
         })
   }
});

export const { clearErrors } = topicSlice.actions;
export default topicSlice.reducer;