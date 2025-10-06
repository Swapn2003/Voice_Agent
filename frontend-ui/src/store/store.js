import { configureStore } from '@reduxjs/toolkit';
import filtersReducer from './filtersSlice';
import casesReducer from './casesSlice';

const store = configureStore({
  reducer: {
    filters: filtersReducer,
    cases: casesReducer
  }
});

export default store;



