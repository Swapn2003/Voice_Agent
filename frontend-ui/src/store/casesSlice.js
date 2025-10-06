import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CaseService } from '../api/api';

export const listFilterThunk = createAsyncThunk('cases/listFilter', async (_arg, thunkAPI) => {
  const state = thunkAPI.getState();
  const criteria = state.filters.criteria || [];
  const body = {
    pageLength: 100,
    pageOffset: 0,
    sortField: 'createdTime',
    exportFlag: false,
    caseType: 'PARENT',
    criteria: criteria.map((c) => ({ field: c.field, operator: c.operator, value: c.value }))
  };
  const data = await CaseService.searchCases(body);
  return data;
});

const casesSlice = createSlice({
  name: 'cases',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(listFilterThunk.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(listFilterThunk.fulfilled, (state, action) => { state.loading = false; state.items = action.payload || []; })
      .addCase(listFilterThunk.rejected, (state, action) => { state.loading = false; state.error = action.error?.message || 'Failed'; });
  }
});

export default casesSlice.reducer;



