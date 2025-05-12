import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface UserState {
  currentUser: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  status: 'idle',
  error: null,
};

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (userId: string) => {
    const response = await fetch(`http://localhost:3001/users/${userId}`);
    return response.json();
  }
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (credentials: { name: string; email: string }) => {
    // In a real app, this would be an actual login API call
    // For now, we'll just create a new user if they don't exist
    const response = await fetch('http://localhost:3001/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...credentials,
        id: `user_${Date.now()}`,
        createdAt: new Date().toISOString(),
      }),
    });
    const user = await response.json();
    localStorage.setItem('userId', user.id);
    return user;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.currentUser = null;
      localStorage.removeItem('userId');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentUser = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch user';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.currentUser = action.payload;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer; 