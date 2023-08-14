import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { fetchCount } from './counterAPI';

interface CounterState {
  value: number;
  status: 'idle' | 'loading';
}

const initialState: CounterState = {
  value: 0,
  status: 'idle'
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state: CounterState) => {
      state.value += 1;
    },
    decrement: (state: CounterState) => {
      state.value -= 1;
    },
    incrementByAmount: (state: CounterState, action: PayloadAction<number>) => {
      state.value += action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(incrementAsync.pending, (state: CounterState) => {
      state.status = 'loading';
    });
    builder.addCase(incrementAsync.fulfilled, (state: CounterState, action: PayloadAction<number>) => {
      state.status = 'idle';
      state.value += action.payload;
    });
  }
});

export const incrementAsync = createAsyncThunk(
  'counter/fetchCount',
  async (amount: number) => {
    const response = await fetchCount(amount);
    return response.data;
  }
);

export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export const selectCount = (state: RootState) => state.counter.value;

export default counterSlice.reducer;
