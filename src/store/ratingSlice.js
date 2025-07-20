import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../utils/api';

const initialState = {
  ratings: [],
  status: 'idle',
  error: null,
};

// Async thunks
export const fetchRatings = createAsyncThunk(
  'ratings/fetchRatings',
  async (courseId, { rejectWithValue }) => {
    try {
      if (courseId) {
        const response = await api.ratings.getByCourse(courseId);
        return response.ratings || response;
      } else {
        const response = await api.ratings.getAll();
        return response.ratings || response;
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchRatingsByUser = createAsyncThunk(
  'ratings/fetchRatingsByUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.ratings.getByUser(userId);
      return response.ratings || response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addRating = createAsyncThunk(
  'ratings/addRating',
  async (ratingData, { rejectWithValue }) => {
    try {
      const response = await api.ratings.create(ratingData);
      return response.rating || response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateRating = createAsyncThunk(
  'ratings/updateRating',
  async ({ id, ...updateData }, { rejectWithValue }) => {
    try {
      const response = await api.ratings.update(id, updateData);
      return response.rating || response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteRating = createAsyncThunk(
  'ratings/deleteRating',
  async (id, { rejectWithValue }) => {
    try {
      await api.ratings.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const ratingSlice = createSlice({
  name: 'ratings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRatings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRatings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.ratings = action.payload;
        state.error = null;
      })
      .addCase(fetchRatings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Falha ao buscar avaliações';
      })
      .addCase(fetchRatingsByUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRatingsByUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.ratings = action.payload;
        state.error = null;
      })
      .addCase(fetchRatingsByUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Falha ao buscar avaliações do usuário';
      })
      .addCase(addRating.fulfilled, (state, action) => {
        state.ratings.push(action.payload);
      })
      .addCase(updateRating.fulfilled, (state, action) => {
        const idx = state.ratings.findIndex(r => r.id === action.payload.id);
        if (idx !== -1) state.ratings[idx] = action.payload;
      })
      .addCase(deleteRating.fulfilled, (state, action) => {
        state.ratings = state.ratings.filter(r => r.id !== action.payload);
      });
  },
});

export default ratingSlice.reducer;