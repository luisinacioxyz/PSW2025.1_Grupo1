import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchUserList = createAsyncThunk(
  'userList/fetchUserList',
  async (userId) => {
    try {
      const response = await fetch(`http://localhost:3001/userLists?userId=${userId}`);
      const list = await response.json();
      
      if (list.length > 0) {
        return list[0];
      } else {
        // Create a new list for this user
        const createResponse = await fetch('http://localhost:3001/userLists', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            courseIds: [],
            createdAt: new Date().toISOString()
          }),
        });
        return createResponse.json();
      }
    } catch (error) {
      console.error('Error fetching or creating user list:', error);
      throw error;
    }
  }
);

export const updateUserList = createAsyncThunk(
  'userList/updateUserList',
  async (userList) => {
    try {
      // Always use PUT to update the existing list
      const response = await fetch(`http://localhost:3001/userLists/${userList.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userList),
      });
      return response.json();
    } catch (error) {
      console.error('Error updating user list:', error);
      throw error;
    }
  }
);

export const addCourseToList = createAsyncThunk(
  'userList/addCourseToList',
  async ({ userList, courseId }, { dispatch }) => {
    try {
      if (!userList || !userList.id) {
        throw new Error('User list not found or not properly initialized');
      }
      
      // Add the course to the list if it's not already there
      if (!userList.courseIds.includes(courseId)) {
        const updatedList = {
          ...userList,
          courseIds: [...userList.courseIds, courseId]
        };
        
        const response = await fetch(`http://localhost:3001/userLists/${userList.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedList),
        });
        
        return response.json();
      }
      
      return userList;
    } catch (error) {
      console.error('Error adding course to list:', error);
      throw error;
    }
  }
);

export const removeCourseFromList = createAsyncThunk(
  'userList/removeCourseFromList',
  async ({ userList, courseId }, { dispatch }) => {
    try {
      if (!userList || !userList.id) {
        throw new Error('User list not found or not properly initialized');
      }
      
      const updatedList = {
        ...userList,
        courseIds: userList.courseIds.filter(id => id !== courseId)
      };
      
      const response = await fetch(`http://localhost:3001/userLists/${userList.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedList),
      });
      
      return response.json();
    } catch (error) {
      console.error('Error removing course from list:', error);
      throw error;
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
    addToList: (state, action) => {
      if (state.userList) {
        if (!state.userList.courseIds.includes(action.payload)) {
          state.userList.courseIds.push(action.payload);
        }
      }
    },
    removeFromList: (state, action) => {
      if (state.userList) {
        state.userList.courseIds = state.userList.courseIds.filter(
          id => id !== action.payload
        );
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserList.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserList.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userList = action.payload;
      })
      .addCase(fetchUserList.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch user list';
      })
      .addCase(updateUserList.fulfilled, (state, action) => {
        state.userList = action.payload;
      })
      .addCase(addCourseToList.fulfilled, (state, action) => {
        state.userList = action.payload;
      })
      .addCase(removeCourseFromList.fulfilled, (state, action) => {
        state.userList = action.payload;
      });
  },
});

export const { addToList, removeFromList } = userListSlice.actions;
export default userListSlice.reducer; 