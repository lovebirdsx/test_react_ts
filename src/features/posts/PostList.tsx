import { useSelector } from 'react-redux';
import { selectAllPosts } from './postSlice';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { AddPostForm } from './AddPortForm';
import { Link } from 'react-router-dom';

export function PostsList() {
  const posts = useSelector(selectAllPosts);
  const renderedPosts = posts.map(post => (
    <Card key={post.id} sx={{ marginTop: 2 }} variant='outlined'>
      <CardContent>
        <Typography variant='h4'>{post.title}</Typography>
        <Typography variant='body1' color={'GrayText'}>{post.content}</Typography>
        <Link to={`/posts/${post.id}`}>
          <Typography variant='body2' color={'GrayText'}>View Post</Typography>
        </Link>
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
