import { configureStore } from '@reduxjs/toolkit';
import courseReducer from './slices/courseSlice';
import ratingReducer from './slices/ratingSlice';
import couponReducer from './slices/couponSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    courses: courseReducer,
    ratings: ratingReducer,
    coupons: couponReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 