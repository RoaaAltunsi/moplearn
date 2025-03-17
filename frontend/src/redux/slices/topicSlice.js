import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../apiClient";


const initialState = {
   categoryTopics: [],
   topics: [],
   loading: false,
   error: ''
};

// --------------------- Async Reducer Functions ---------------------
// GET-TOPICS-BY-CATEGORY: Fetch all topics under specific category
export const getTopicsByCategory = createAsyncThunk('topic/getByCategory', async (categoryId, thinkAPI) => {
   try {
      const response = await apiClient.get(`topics/categories/${categoryId}`);
      return response.data;

   } catch (error) {
      return thinkAPI.rejectWithValue("Failed to fetch topics under this category");
   }
});

// GET-ALL-TOPICS: Fetch all topics
export const getAllTopics = createAsyncThunk('topic/getAll', async (_, thunkAPI) => {
   try {
      const response = await apiClient.get('topics');
      return response.data;

   } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch topics");
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
         .addCase(getTopicsByCategory.pending, (state) => {
            state.loading = true;
         })
         .addCase(getTopicsByCategory.fulfilled, (state, action) => {
            state.loading = false;
            state.categoryTopics = action.payload;
            state.error = '';
         })
         .addCase(getTopicsByCategory.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
         })

         // ----------------------- get all topics -----------------------
         .addCase(getAllTopics.pending, (state) => {
            state.loading = true;
         })
         .addCase(getAllTopics.fulfilled, (state, action) => {
            state.loading = false;
            state.topics = action.payload;
            state.error = '';
         })
         .addCase(getAllTopics.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
         })
   }
});

export const { clearErrors } = topicSlice.actions;
export default topicSlice.reducer;