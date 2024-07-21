import { Box, Button, TextField, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hook';
import { selectPostById, postUpdated } from './postSlice';

export function EditPostForm() {
  const { postId } = useParams<{ postId: string }>();
  if (!postId) {
    throw new Error('postId is required');
  }

  const dispath = useAppDispatch();
  const navigate = useNavigate();
  const post = useAppSelector((state) => selectPostById(state, postId));
  const [title, setTitle] = useState(post?.title);
  const [content, setContent] = useState(post?.content);
  if (!post) {
    return (
      <Box>
        <Typography variant="h2">Post {postId} not found!</Typography>
      </Box>
    );
  }

  const onSavePostClicked = () => {
    if (title && content) {
      dispath(postUpdated({ id: postId, changes: { title, content } }));
      navigate(`/posts/${postId}`);
    }
  };

  return (
    <Box p={1}>
      <Typography variant="h2">Edit Post</Typography>
      <form>
        <Box py={2}>
          <TextField
            id="postTitle"
            name="postTitle"
            label="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Box>
        <Box py={2}>
          <TextField
            id="postContent"
            name="postContent"
            label="Content"
            multiline
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </Box>
        <Box py={2}>
          <Button variant="contained" color="primary" onClick={onSavePostClicked}>
            Save Post
          </Button>
        </Box>
      </form>
    </Box>
  );
}
