import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import courseReducer from './store/courseSlice';
import ratingReducer from './store/ratingSlice';
import couponReducer from './store/couponSlice';
import userReducer from './store/userSlice';
import userListReducer from './store/userListSlice';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Configure Redux store
const store = configureStore({
  reducer: {
    courses: courseReducer,
    ratings: ratingReducer,
    coupons: couponReducer,
    user: userReducer,
    userList: userListReducer,
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
