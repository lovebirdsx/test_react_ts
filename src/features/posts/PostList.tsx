import { useAppSelector } from '../../app/hook';
import { selectAllPosts } from './postSlice';
import { selectAllUsers } from '../users/userSlice';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { AddPostForm } from './AddPostForm';
import { Link } from 'react-router-dom';

export function PostsList() {
  const posts = useAppSelector(selectAllPosts);
  const users = useAppSelector(selectAllUsers);
  const renderedPosts = posts.map(post => (
    <Card key={post.id} sx={{ marginTop: 2 }} variant='outlined'>
      <CardContent>
        <Typography variant='h4'>{post.title}</Typography>
        <Typography variant='body1' color={'GrayText'}>{post.content}</Typography>
        <Box display={'flex'} alignItems={'flex-end'} justifyContent={'space-between'}>
          <Typography variant='body1' color={'GrayText'}>By {users.find((e) => e.id === post.userId)?.name}</Typography>
          <Box m={1}>
            <Link to={`/posts/${post.id}`}>
              <Typography variant='body2' color={'GrayText'}>View Post</Typography>
            </Link>
          </Box>
        </Box>
      </CardContent>
    </Card>
  ));

  return (
    <Box px={1}>
      <Box py={1}>
        <Typography variant='h2'>Posts</Typography>
        {renderedPosts}
      </Box>
      <Box py={1}>
        <AddPostForm />
      </Box>
    </Box>
  );
}
