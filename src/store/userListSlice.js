import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../utils/api';

// Async thunks
export const fetchUserList = createAsyncThunk(
  'userList/fetchUserList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.lists.getMy();
      return response.list || response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserListByUserId = createAsyncThunk(
  'userList/fetchUserListByUserId',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.lists.getByUser(userId);
      return response.list || response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addToList = createAsyncThunk(
  'userList/addToList',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await api.lists.addCourse(courseId);
      return response.list || response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromList = createAsyncThunk(
  'userList/removeFromList',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await api.lists.removeCourse(courseId);
      return response.list || response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Mantendo compatibilidade com os nomes antigos
export const addCourseToList = createAsyncThunk(
  'userList/addCourseToList',
  async ({ courseId }, { rejectWithValue }) => {
    try {
      const response = await api.lists.addCourse(courseId);
      return response.list || response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeCourseFromList = createAsyncThunk(
  'userList/removeCourseFromList',
  async ({ courseId }, { rejectWithValue }) => {
    try {
      const response = await api.lists.removeCourse(courseId);
      return response.list || response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  userList: null,
  status: 'idle',
  error: null,
};

const userListSlice = createSlice({
  name: 'userList',
  initialState,
  reducers: {
    clearUserList: (state) => {
      state.userList = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch User List
      .addCase(fetchUserList.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUserList.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userList = action.payload;
        state.error = null;
      })
      .addCase(fetchUserList.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch user list';
      })
      
      // Fetch User List By User ID
      .addCase(fetchUserListByUserId.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUserListByUserId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userList = action.payload;
        state.error = null;
      })
      .addCase(fetchUserListByUserId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch user list';
      })
      
      // Add to List
      .addCase(addToList.pending, (state) => {
        state.error = null;
      })
      .addCase(addToList.fulfilled, (state, action) => {
        state.userList = action.payload;
        state.error = null;
      })
      .addCase(addToList.rejected, (state, action) => {
        state.error = action.payload || 'Failed to add course to list';
      })
      
      // Remove from List
      .addCase(removeFromList.pending, (state) => {
        state.error = null;
      })
      .addCase(removeFromList.fulfilled, (state, action) => {
        state.userList = action.payload;
        state.error = null;
      })
      .addCase(removeFromList.rejected, (state, action) => {
        state.error = action.payload || 'Failed to remove course from list';
      })
      
      // Add Course to List (compatibilidade)
      .addCase(addCourseToList.fulfilled, (state, action) => {
        state.userList = action.payload;
        state.error = null;
      })
      .addCase(addCourseToList.rejected, (state, action) => {
        state.error = action.payload || 'Failed to add course to list';
      })
      
      // Remove Course from List (compatibilidade)
      .addCase(removeCourseFromList.fulfilled, (state, action) => {
        state.userList = action.payload;
        state.error = null;
      })
      .addCase(removeCourseFromList.rejected, (state, action) => {
        state.error = action.payload || 'Failed to remove course from list';
      });
  },
});

export const { clearUserList } = userListSlice.actions;
export default userListSlice.reducer;
