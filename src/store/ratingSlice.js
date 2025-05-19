import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  ratings: [],
  status: 'idle',
  error: null,
};

// 1) Busca todas as avaliações de um usuário
export const fetchRatings = createAsyncThunk(
  'ratings/fetchRatings',
  async (userId) => {
    const res = await fetch(`http://localhost:3001/ratings?userId=${userId}`);
    if (!res.ok) throw new Error('Erro ao buscar avaliações');
    return await res.json();
  }
);

// 2) Adiciona uma avaliação nova
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

// 3) Atualiza uma avaliação existente
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

// 4) Deleta uma avaliação pelo ID
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
      // fetchRatings
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

      // addRating
      .addCase(addRating.fulfilled, (state, action) => {
        state.ratings.push(action.payload);
      })

      // updateRating
      .addCase(updateRating.fulfilled, (state, action) => {
        const idx = state.ratings.findIndex(r => r.id === action.payload.id);
        if (idx !== -1) state.ratings[idx] = action.payload;
      })

      // deleteRating
      .addCase(deleteRating.fulfilled, (state, action) => {
        state.ratings = state.ratings.filter(r => r.id !== action.payload);
      });
  },
});

export default ratingSlice.reducer;
