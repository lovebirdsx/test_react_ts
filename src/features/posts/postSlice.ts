import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface IPost {
  id: string;
  title: string;
  content: string;
}

const initialState: IPost[] = [
  { id: '1', title: 'First Post!', content: 'Hello!' },
  { id: '2', title: 'Second Post', content: 'More text' },
]

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {}
});

export const selectAllPosts = (state: RootState) => state.posts;

export default postSlice.reducer;
