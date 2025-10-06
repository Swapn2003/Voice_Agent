import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  gridId: 'cases',
  criteria: [] // { field, operator, value }
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    addFilterCriteria: (state, action) => {
      state.criteria.push(action.payload);
    },
    removeFilterCriteria: (state, action) => {
      const idx = state.criteria.findIndex((c) => c.field === action.payload.field && c.operator === action.payload.operator);
      if (idx >= 0) state.criteria.splice(idx, 1);
    },
    clearFilters: (state) => {
      state.criteria = [];
    },
    setCriteria: (state, action) => {
      state.criteria = Array.isArray(action.payload) ? action.payload : [];
    }
  }
});

export const { addFilterCriteria, removeFilterCriteria, clearFilters, setCriteria } = filtersSlice.actions;
export default filtersSlice.reducer;



