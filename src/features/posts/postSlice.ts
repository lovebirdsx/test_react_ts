import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { Post } from '../../app/types';
import { RootState } from '../../app/store';

const postAdapter = createEntityAdapter<Post>({
  selectId: (post) => post.id,
  sortComparer: (a, b) => b.title.localeCompare(a.title),
});

const initialState = postAdapter.getInitialState({
  ids: ['0', '1', '2'],
  entities: {
    '0': { id: '0', title: 'Redux', content: 'State management' },
    '1': { id: '1', title: 'React', content: 'UI library' },
    '2': { id: '2', title: 'React-Redux', content: 'React bindings' },
  }
});

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postAdded: postAdapter.addOne,
  }
});

export const {
  selectAll: selectAllPosts,
  selectIds: selectPostIds,
  selectById: selectPostById,
} = postAdapter.getSelectors<RootState>(state => state.posts);
export const { postAdded } = postSlice.actions;

export default postSlice.reducer;
