import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks
export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async () => {
    const response = await fetch('http://localhost:3001/courses');
    return response.json();
  }
);

export const addCourse = createAsyncThunk(
  'courses/addCourse',
  async (course) => {
    const response = await fetch('http://localhost:3001/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(course),
    });
    return response.json();
  }
);

export const updateCourse = createAsyncThunk(
  'courses/updateCourse',
  async (course) => {
    const response = await fetch(`http://localhost:3001/courses/${course.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(course),
    });
    return response.json();
  }
);

export const deleteCourse = createAsyncThunk(
  'courses/deleteCourse',
  async (id) => {
    await fetch(`http://localhost:3001/courses/${id}`, {
      method: 'DELETE',
    });
    return id;
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
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch courses';
      })
      .addCase(addCourse.fulfilled, (state, action) => {
        state.courses.push(action.payload);
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        const index = state.courses.findIndex(course => course.id === action.payload.id);
        if (index !== -1) {
          state.courses[index] = action.payload;
        }
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.courses = state.courses.filter(course => course.id !== action.payload);
      });
  },
});

export const { setSearchTerm, setSelectedPlatform } = courseSlice.actions;
export default courseSlice.reducer; 