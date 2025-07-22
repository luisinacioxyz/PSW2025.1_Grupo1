import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../utils/api';
import { addRating, updateRating, deleteRating } from './ratingSlice';

// Async thunks
export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.courses.getAll(params);
      return response.courses || response; // API retorna { courses: [...], pagination: {...} }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCourseById = createAsyncThunk(
  'courses/fetchCourseById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.courses.getById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addCourse = createAsyncThunk(
  'courses/addCourse',
  async (courseData, { rejectWithValue }) => {
    try {
      const response = await api.courses.create(courseData);
      return response.course || response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCourse = createAsyncThunk(
  'courses/updateCourse',
  async (courseData, { rejectWithValue }) => {
    try {
      const response = await api.courses.update(courseData.id, courseData);
      return response.course || response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCourse = createAsyncThunk(
  'courses/deleteCourse',
  async (id, { rejectWithValue }) => {
    try {
      await api.courses.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  courses: [],
  status: 'idle',
  error: null,
  searchTerm: '',
  selectedPlatform: '',
};

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setSelectedPlatform: (state, action) => {
      state.selectedPlatform = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.courses = action.payload;
        state.error = null;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch courses';
      })
      
      .addCase(fetchCourseById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Adicionar ou atualizar curso na lista se não existir
        const existingIndex = state.courses.findIndex(course => course._id === action.payload._id);
        if (existingIndex !== -1) {
          state.courses[existingIndex] = action.payload;
        } else {
          state.courses.push(action.payload);
        }
        state.error = null;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch course';
      })
      
      .addCase(addCourse.pending, (state) => {
        state.error = null;
      })
      .addCase(addCourse.fulfilled, (state, action) => {
        state.courses.push(action.payload);
        state.error = null;
      })
      .addCase(addCourse.rejected, (state, action) => {
        state.error = action.payload || 'Failed to add course';
      })
      
      .addCase(updateCourse.pending, (state) => {
        state.error = null;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        const index = state.courses.findIndex(course => course._id === action.payload._id);
        if (index !== -1) {
          state.courses[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.error = action.payload || 'Failed to update course';
      })
      
      .addCase(deleteCourse.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.courses = state.courses.filter(course => course._id !== action.payload);
        state.error = null;
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.error = action.payload || 'Failed to delete course';
      })
      
      // Escutar as ações do ratingSlice para atualizar os ratings dos cursos
      .addCase(addRating.fulfilled, (state, action) => {
        if (action.payload.updatedCourse) {
          const index = state.courses.findIndex(course => course._id === action.payload.updatedCourse._id);
          if (index !== -1) {
            state.courses[index] = { ...state.courses[index], ...action.payload.updatedCourse };
          }
        }
      })
      .addCase(updateRating.fulfilled, (state, action) => {
        if (action.payload.updatedCourse) {
          const index = state.courses.findIndex(course => course._id === action.payload.updatedCourse._id);
          if (index !== -1) {
            state.courses[index] = { ...state.courses[index], ...action.payload.updatedCourse };
          }
        }
      })
      .addCase(deleteRating.fulfilled, (state, action) => {
        if (action.payload.updatedCourse) {
          const index = state.courses.findIndex(course => course._id === action.payload.updatedCourse._id);
          if (index !== -1) {
            state.courses[index] = { ...state.courses[index], ...action.payload.updatedCourse };
          }
        }
      });
  },
});

export const { setSearchTerm, setSelectedPlatform } = courseSlice.actions;
export default courseSlice.reducer; 