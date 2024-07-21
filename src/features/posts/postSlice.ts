import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { Post } from '../../app/types';
import { RootState } from '../../app/store';
import { client } from '../../api/client';

interface IPostsState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
}

const postAdapter = createEntityAdapter<Post>({
  selectId: (post) => post.id,
  sortComparer: (a, b) => b.title.localeCompare(a.title),
});

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const res = await client.get('/fakeApi/posts');
  return res.data as Post[];
});

const postSlice = createSlice({
  name: 'posts',
  initialState: postAdapter.getInitialState<IPostsState>({
    status: 'idle',
  }),
  reducers: {
    postAdded: postAdapter.addOne,
    postUpdated: postAdapter.updateOne,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPosts.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.status = 'succeeded';
      postAdapter.upsertMany(state, action.payload);
    });
    builder.addCase(fetchPosts.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    });
  },
});

export const {
  selectAll: selectAllPosts,
  selectIds: selectPostIds,
  selectById: selectPostById,
} = postAdapter.getSelectors<RootState>((state) => state.posts);
export const { postAdded, postUpdated } = postSlice.actions;

export default postSlice.reducer;
