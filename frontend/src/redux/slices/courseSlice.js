import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../apiClient";

const initialState = {
   newCourses: [],
   cheapestCourses: [],
   coursesByCategory: [],
   loading: false,
   error: ''
};


// --------------------- Async Reducer Functions ---------------------
// GET-NEW-COURSES: Fetch the latest new courses
export const getNewestCourses = createAsyncThunk('course/getNewest', async (_, thunkAPI) => {
   try {
      const response = await apiClient.get('new-courses');
      return response.data;

   } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch new courses");
   }
});

// GET-CHEAPEST-COURSES: Fetch the cheapest courses
export const getCheapestCourses = createAsyncThunk('course/getCheapest', async (_, thunkAPI) => {
   try {
      const response = await apiClient.get('cheapest-courses');
      return response.data;

   } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch the exclusive discounted courses");
   }
});

// GET-COURSES-BY-CATEGORY: Fetch all courses under specific category
export const getCoursesByCategory = createAsyncThunk('course/getCoursesByCategory', async (categoryId, thunkAPI) => {
   try {
      const response = await apiClient.get(`categories/${categoryId}/courses`);
      return response.data;

   } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch courses for this category");
   }
});

const courseSlice = createSlice({
   name: 'course',
   initialState,
   reducers: {
      clearErrors: (state) => {
         state.error = '';
      }
   },
   extraReducers: (builder) => {
      builder
         // --------------------- get new courses ---------------------
         .addCase(getNewestCourses.pending, (state) => {
            state.loading = true;
         })
         .addCase(getNewestCourses.fulfilled, (state, action) => {
            state.loading = false;
            state.newCourses = action.payload;
            state.error = '';
         })
         .addCase(getNewestCourses.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
         })

         // ------------------- get cheapest courses -------------------
         .addCase(getCheapestCourses.pending, (state) => {
            state.loading = true;
         })
         .addCase(getCheapestCourses.fulfilled, (state, action) => {
            state.loading = false;
            state.cheapestCourses = action.payload;
            state.error = '';
         })
         .addCase(getCheapestCourses.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
         })

         // ----------------- get courses by category ------------------
         .addCase(getCoursesByCategory.pending, (state) => {
            state.loading = true;
         })
         .addCase(getCoursesByCategory.fulfilled, (state, action) => {
            state.loading = false;
            state.coursesByCategory = action.payload;
            state.error = '';
         })
         .addCase(getCoursesByCategory.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
         })
   }
});

export const { clearErrors } = courseSlice.actions;
export default courseSlice.reducer;