import { createSlice } from '@reduxjs/toolkit';

export const formsSlice = createSlice({
  name: 'forms',
  initialState: {
    list: [],
  },
  reducers: {
    addForm: (state, action) => {
      state.list.push(action.payload);
    },
  },
});

export const { addForm } = formsSlice.actions;

export default formsSlice.reducer;
