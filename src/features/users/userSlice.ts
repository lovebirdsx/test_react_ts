import { createAsyncThunk, createSlice, createEntityAdapter } from '@reduxjs/toolkit';

import { User } from '../../app/types';
import { RootState } from '../../app/store';
import { client } from '../../api/client';

const userAdapter = createEntityAdapter<User>({
  selectId: (user) => user.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await client.get('/fakeApi/users');
  return response.data;
});

const userSlice = createSlice({
  name: 'users',
  initialState: userAdapter.getInitialState(),
  reducers: {
    addUser: userAdapter.addOne,
    updateUser: userAdapter.updateOne,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      userAdapter.setAll(state, action.payload);
    });
  },
});

export const { addUser, updateUser } = userSlice.actions;
export const { selectById: selectUserById, selectAll: selectAllUsers } = userAdapter.getSelectors<RootState>(
  (state) => state.users,
);

export default userSlice.reducer;
