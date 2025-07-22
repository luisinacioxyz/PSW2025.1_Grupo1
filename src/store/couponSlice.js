import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../utils/api';

export const fetchCoupons = createAsyncThunk(
  'coupons/fetchCoupons',
  async (userId) => {
    const data = await api.coupons.getMy();
    console.log('Fetched coupons:', data); // Log the response
    return data.coupons || []; // Ensure this is an array
  }
);

export const addCoupon = createAsyncThunk(
  'coupons/addCoupon',
  async (coupon) => {
    const data = await api.coupons.create(coupon);
    return data;
  }
);

export const updateCoupon = createAsyncThunk(
  'coupons/updateCoupon',
  async (coupon) => {
    // Note: This function may need to be implemented in api.js if needed
    const response = await fetch(`http://localhost:3001/api/coupons/${coupon.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(coupon),
    });
    return response.json();
  }
);

export const deleteCoupon = createAsyncThunk(
  'coupons/deleteCoupon',
  async (id) => {
    await api.coupons.delete(id);
    return id;
  }
);

const initialState = {
  coupons: [],
  status: 'idle',
  error: null,
};

const couponSlice = createSlice({
  name: 'coupons',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoupons.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.coupons = action.payload;
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch coupons';
      })
      .addCase(addCoupon.fulfilled, (state, action) => {
        state.coupons.push(action.payload);
      })
      .addCase(updateCoupon.fulfilled, (state, action) => {
        const index = state.coupons.findIndex(coupon => coupon.id === action.payload.id);
        if (index !== -1) {
          state.coupons[index] = action.payload;
        }
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.coupons = state.coupons.filter(coupon => coupon.id !== action.payload);
      });
  },
});

export default couponSlice.reducer; 