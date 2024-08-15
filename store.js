import { configureStore } from '@reduxjs/toolkit';
import formsReducer from './slices/formsSlice';

export const store = configureStore({
  reducer: {
    forms: formsReducer,
  },
});

export default store;
