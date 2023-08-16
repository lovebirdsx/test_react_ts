import { createSlice } from "@reduxjs/toolkit";
import { createEntityAdapter } from "@reduxjs/toolkit";
import { User } from "../../app/types";
import { RootState } from "../../app/store";

const userAdapter = createEntityAdapter<User>({
  selectId: (user) => user.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

const initialState = userAdapter.getInitialState();
initialState.ids = [1, 2]
initialState.entities = {
  1: { name: 'John', id: 1 },
  2: { name: 'Jane', id: 2 },
}

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addUser: userAdapter.addOne,
    updateUser: userAdapter.updateOne,
  }
});

export const { addUser, updateUser } = userSlice.actions;
export const { selectById: selectUserById, selectAll: selectAllUsers } = userAdapter.getSelectors<RootState>((state) => state.users);

export default userSlice.reducer;
