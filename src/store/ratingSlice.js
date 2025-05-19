import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  ratings: [],
  status: 'idle',
  error: null,
};


export const fetchRatings = createAsyncThunk(
  'ratings/fetchRatings',
  async (courseId) => {
    const response = await fetch(`http://localhost:3001/ratings?courseId=${courseId}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Falha ao buscar avaliações');
    }
    
    return response.json();
  }
);

export const addRating = createAsyncThunk(
  'ratings/addRating',
  async ({ courseId, userId, rating, review }) => {
    const payload = {
      courseId,
      userId,
      rating,
      review,
      createdAt: new Date().toISOString()
    };
    const res = await fetch('http://localhost:3001/ratings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Erro ao adicionar avaliação');
    return await res.json();
  }
);

export const updateRating = createAsyncThunk(
  'ratings/updateRating',
  async ({ id, courseId, userId, rating, review, createdAt }) => {
    const payload = { id, courseId, userId, rating, review, createdAt };
    const res = await fetch(`http://localhost:3001/ratings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Erro ao atualizar avaliação');
    return await res.json();
  }
);

export const deleteRating = createAsyncThunk(
  'ratings/deleteRating',
  async (id) => {
    const res = await fetch(`http://localhost:3001/ratings/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Erro ao deletar avaliação');
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
        state.error = null;
      })
      .addCase(fetchRatings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Falha ao buscar avaliações';
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
