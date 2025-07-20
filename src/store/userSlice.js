import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../utils/api';

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.users.getById(userId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Manter compatibilidade com código existente - mas será depreciado
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      // Redirecionar para o authSlice
      const response = await api.auth.login(credentials);
      return response.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Função para verificar se há usuário autenticado
const getCurrentUser = () => {
  // Verificar se há token e buscar dados do usuário via API
  const token = localStorage.getItem('authToken');
  return token ? null : null; // Será carregado via initializeAuth
};

const initialState = {
  currentUser: getCurrentUser(),
  status: 'idle',
  error: null,
};

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
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch user';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.currentUser = action.payload;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer; 