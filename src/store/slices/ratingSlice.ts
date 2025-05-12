import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Rating {
  id: number;
  courseId: number;
  userId: string;
  rating: number;
  review: string;
  createdAt: string;
}

interface RatingState {
  ratings: Rating[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: RatingState = {
  ratings: [],
  status: 'idle',
  error: null,
};

export const fetchRatings = createAsyncThunk(
  'ratings/fetchRatings',
  async (courseId: number) => {
    const response = await fetch(`http://localhost:3001/ratings?courseId=${courseId}`);
    return response.json();
  }
);

export const addRating = createAsyncThunk(
  'ratings/addRating',
  async (rating: Omit<Rating, 'id'>) => {
    const response = await fetch('http://localhost:3001/ratings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...rating, createdAt: new Date().toISOString() }),
    });
    return response.json();
  }
);

export const updateRating = createAsyncThunk(
  'ratings/updateRating',
  async (rating: Rating) => {
    const response = await fetch(`http://localhost:3001/ratings/${rating.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rating),
    });
    return response.json();
  }
);

export const deleteRating = createAsyncThunk(
  'ratings/deleteRating',
  async (id: number) => {
    await fetch(`http://localhost:3001/ratings/${id}`, {
      method: 'DELETE',
    });
    return id;
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
      })
      .addCase(fetchRatings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch ratings';
      })
      .addCase(addRating.fulfilled, (state, action) => {
        state.ratings.push(action.payload);
      })
      .addCase(updateRating.fulfilled, (state, action) => {
        const index = state.ratings.findIndex(rating => rating.id === action.payload.id);
        if (index !== -1) {
          state.ratings[index] = action.payload;
        }
      })
      .addCase(deleteRating.fulfilled, (state, action) => {
        state.ratings = state.ratings.filter(rating => rating.id !== action.payload);
      });
  },
});

export default ratingSlice.reducer; 