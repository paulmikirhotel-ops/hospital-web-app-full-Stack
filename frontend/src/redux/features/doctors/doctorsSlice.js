import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../../api/axios';

// Action to fetch doctors from your backend
export const fetchDoctors = createAsyncThunk('doctors/fetchDoctors', async () => {
  const response = await axios.get('/doctors');
  return response.data;
});

const doctorSlice = createSlice({
  name: 'doctors',
  initialState: { doctors: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.doctors = action.payload;
      });
  },
});

export default doctorSlice.reducer;