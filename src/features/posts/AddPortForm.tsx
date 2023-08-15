import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { postAdded } from './postSlice';
import { useAppDispatch } from '../../app/hook';
import { nanoid } from '@reduxjs/toolkit';

export function AddPostForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const dispath = useAppDispatch();
  const onTitleChanged = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
  const onContentChanged = (e: React.ChangeEvent<HTMLInputElement>) => setContent(e.target.value);
  const onSavePostClicked = () => {
    if (title && content) {
      const id = nanoid();
      dispath(postAdded({ id, title, content }));
      setTitle('');
      setContent('');
    }
  };

  return (
    <Box>
      <Typography variant='h2'>Add a New Post</Typography>
      <form>
        <Box py={2}>
          <TextField
            id='postTitle'
            name='postTitle'
            label='Post Title'
            value={title}
            onChange={onTitleChanged}
          />
        </Box>
        <Box py={2}>
          <TextField
            id='postContent'
            name='postContent'
            label='Content'
            multiline
            rows={4}
            value={content}
            onChange={onContentChanged}
          />
        </Box>
        <Box py={2}>
          <Button variant='contained' color='primary' onClick={onSavePostClicked}>
            Save Post
          </Button>
        </Box>
      </form>
    </Box>
  );
}
