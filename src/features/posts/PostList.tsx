import { Box, Card, CardContent, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hook';
import { fetchPosts, selectAllPosts } from './postSlice';
import { selectAllUsers } from '../users/userSlice';
import { AddPostForm } from './AddPostForm';

export function PostsList() {
  const posts = useAppSelector(selectAllPosts);
  const postStatus = useAppSelector((state) => state.posts.status);
  const error = useAppSelector((state) => state.posts.error);
  const users = useAppSelector(selectAllUsers);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (postStatus === 'idle') {
      dispatch(fetchPosts());
    }
  }, [postStatus, dispatch]);

  if (postStatus === 'loading') {
    return <Typography variant="h2">Loading...</Typography>;
  }
  if (postStatus === 'failed') {
    return <Typography variant="h2">{error}</Typography>;
  }

  const renderedPosts = posts.map((post) => (
    <Card key={post.id} sx={{ marginTop: 2 }} variant="outlined">
      <CardContent>
        <Typography variant="h4">{post.title}</Typography>
        <Typography variant="body1" color={'GrayText'}>
          {post.content}
        </Typography>
        <Box display={'flex'} alignItems={'flex-end'} justifyContent={'space-between'}>
          <Typography variant="body1" color={'GrayText'}>
            By {users.find((e) => e.id === post.user)?.name}
          </Typography>
          <Box m={1}>
            <Link to={`/posts/${post.id}`}>
              <Typography variant="body2" color={'GrayText'}>
                View Post
              </Typography>
            </Link>
          </Box>
        </Box>
      </CardContent>
    </Card>
  ));

  return (
    <Box px={1}>
      <Box py={1}>
        <Typography variant="h2">Posts</Typography>
        {renderedPosts}
      </Box>
      <Box py={1}>
        <AddPostForm />
      </Box>
    </Box>
  );
}
