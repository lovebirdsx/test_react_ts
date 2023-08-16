import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { Post } from '../../app/types';
import { RootState } from '../../app/store';

const postAdapter = createEntityAdapter<Post>({
  selectId: (post) => post.id,
  sortComparer: (a, b) => b.title.localeCompare(a.title),
});

const initialState = postAdapter.getInitialState();
initialState.ids = ['0', '1', '2'];
initialState.entities = {
  '0': { id: '0', title: 'Redux', content: 'State management', userId: 1 },
  '1': { id: '1', title: 'React', content: 'UI library', userId: 2 },
  '2': { id: '2', title: 'React-Redux', content: 'React bindings', userId: 1 },
}

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postAdded: postAdapter.addOne,
    postUpdated: postAdapter.updateOne,
  }
});

export const {
  selectAll: selectAllPosts,
  selectIds: selectPostIds,
  selectById: selectPostById,
} = postAdapter.getSelectors<RootState>(state => state.posts);
export const { postAdded, postUpdated } = postSlice.actions;

export default postSlice.reducer;
