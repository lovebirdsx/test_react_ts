import { RouteComponentProps } from 'react-router-dom';
import { selectPostById } from './postSlice';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { useAppSelector } from '../../app/hook';

export function SinglePostPage({ match }: RouteComponentProps<{ postId: string }>) {
  const { postId } = match.params;
  const post = useAppSelector(state => selectPostById(state, postId));
  if (!post) {
    return (
      <Box>
        <Typography variant="h2">Post {postId} not found!</Typography>
      </Box>
    )
  }

  return (
    <Card sx={{ margin: 2 }} variant='outlined'>
      <CardContent>
        <Typography variant='h4'>{post.title}</Typography>
        <Typography variant='body1' color={'GrayText'}>{post.content}</Typography>
      </CardContent>
    </Card>
  );
}