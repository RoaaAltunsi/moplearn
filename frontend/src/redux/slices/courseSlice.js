import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../apiClient";
import { getUserCourses } from "./userSlice";

const initialState = {
   newCourses: [],
   cheapestCourses: [],
   coursesByCategory: [],
   pagination: {},
   loading: false,
   error: ''
};


// --------------------- Async Reducer Functions ---------------------
// GET-NEW-COURSES: Fetch the latest new courses
export const getNewestCourses = createAsyncThunk('course/getNewest', async (_, thunkAPI) => {
   try {
      const response = await apiClient.get('courses/new');
      return response.data;

   } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch new courses");
   }
});

// GET-CHEAPEST-COURSES: Fetch the cheapest courses
export const getCheapestCourses = createAsyncThunk('course/getCheapest', async (_, thunkAPI) => {
   try {
      const response = await apiClient.get('courses/cheapest');
      return response.data;

   } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch the exclusive discounted courses");
   }
});

// GET-COURSES-BY-CATEGORY: Fetch all courses under specific category
export const getCoursesByCategory = createAsyncThunk('course/getCoursesByCategory',
   async ({ categoryId, params }, thunkAPI) => {
      try {
         const response = await apiClient.get(`courses/categories/${categoryId}`, {
            params
         });
         return response.data;

      } catch (error) {
         return thunkAPI.rejectWithValue("Failed to fetch courses for this category");
      }
   });

// ADD-TO-PARTNER-LIST: Add user to course's partner list 
export const addToPartnerList = createAsyncThunk('course/addToPartnerList',
   async ({ user_id, course_id }, thunkAPI) => {
      try {
         await apiClient.post(`courses/${course_id}/partner-list`);
         thunkAPI.dispatch(getUserCourses(user_id));

      } catch (error) {
         return thunkAPI.rejectWithValue("Failed to add user to partner list");
      }
   });

// REMOVE-FROM-PARTNER-LIST: Remove user from course's partner list 
export const removeFromPartnerList = createAsyncThunk('course/removeFromPartnerList',
   async ({ user_id, course_id }, thunkAPI) => {
      try {
         await apiClient.delete(`courses/${course_id}/partner-list`);
         thunkAPI.dispatch(getUserCourses(user_id));

      } catch (error) {
         return thunkAPI.rejectWithValue("Failed to remove user from partner list");
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
            state.coursesByCategory = action.payload?.courses;
            state.pagination = action.payload?.pagination;
            state.error = '';
         })
         .addCase(getCoursesByCategory.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
         })

         // -------------- add to course's partner list ----------------
         .addCase(addToPartnerList.pending, (state) => {
            state.loading = true;
         })
         .addCase(addToPartnerList.fulfilled, (state) => {
            state.loading = false;
            state.error = '';
         })
         .addCase(addToPartnerList.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
         })

         // ------------ remove from course's partner list --------------
         .addCase(removeFromPartnerList.pending, (state) => {
            state.loading = true;
         })
         .addCase(removeFromPartnerList.fulfilled, (state) => {
            state.loading = false;
            state.error = '';
         })
         .addCase(removeFromPartnerList.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
         })
   }
});

export const { clearErrors } = courseSlice.actions;
export default courseSlice.reducer;