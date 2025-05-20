import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCoupons = createAsyncThunk(
  'coupons/fetchCoupons',
  async (userId) => {
    const response = await fetch(`http://localhost:3001/coupons?userId=${userId}`);
    return response.json();
  }
);

export const addCoupon = createAsyncThunk(
  'coupons/addCoupon',
  async (coupon) => {
    const response = await fetch('http://localhost:3001/coupons', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(coupon),
    });
    return response.json();
  }
);

export const updateCoupon = createAsyncThunk(
  'coupons/updateCoupon',
  async (coupon) => {
    const response = await fetch(`http://localhost:3001/coupons/${coupon.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(coupon),
    });
    return response.json();
  }
);

export const deleteCoupon = createAsyncThunk(
  'coupons/deleteCoupon',
  async (id) => {
    await fetch(`http://localhost:3001/coupons/${id}`, {
      method: 'DELETE',
    });
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