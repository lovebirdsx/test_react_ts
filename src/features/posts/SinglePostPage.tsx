import { useParams } from 'react-router-dom';
import { selectPostById } from './postSlice';
import { selectUserById } from '../users/userSlice';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { useAppSelector } from '../../app/hook';
import { Link } from 'react-router-dom';

export function SinglePostPage() {
  const { postId } = useParams<{ postId: string }>();
  if (!postId) {
    throw new Error('Post ID is required!');
  }

  const post = useAppSelector(state => selectPostById(state, postId));
  const user = useAppSelector(state => selectUserById(state, post?.user || ''));
  if (!post) {
    return (
      <Box>
        <Typography variant="h2">Post {postId} not found!</Typography>
      </Box>
    )
  }

  return (
    <Box px={2}>
      <Card variant='outlined'>
        <CardContent>
          <Typography variant='h4'>{post.title}</Typography>
          <Typography variant='body1' color={'GrayText'}>By {user?.name}</Typography>
          <Typography variant='body1' color={'GrayText'}>{post.content}</Typography>
        </CardContent>
      </Card>
      <Link to={`/editPost/${post.id}`}>
        <Typography variant='body1'>Edit Post</Typography>
      </Link>
    </Box>
  );
}