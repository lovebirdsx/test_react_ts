import React, { useState } from 'react';
import { Box, Button, FormControl, MenuItem, Select, TextField, Typography } from '@mui/material';
import { nanoid } from '@reduxjs/toolkit';
import { postAdded } from './postSlice';
import { selectAllUsers } from '../users/userSlice';
import { useAppDispatch, useAppSelector } from '../../app/hook';

export function AddPostForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [user, setUser] = useState('');

  const users = useAppSelector(selectAllUsers);

  const dispath = useAppDispatch();
  const onTitleChanged = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
  const onContentChanged = (e: React.ChangeEvent<HTMLInputElement>) => setContent(e.target.value);
  const onSavePostClicked = () => {
    if (title && content) {
      const id = nanoid();
      dispath(postAdded({ id, title, content, user }));
      setTitle('');
      setContent('');
    }
  };

  return (
    <Box>
      <Typography variant="h2">Add a New Post</Typography>
      <form>
        <Box py={2}>
          <TextField id="postTitle" name="postTitle" label="Post Title" value={title} onChange={onTitleChanged} />
        </Box>
        <Box py={2}>
          <TextField
            id="postContent"
            name="postContent"
            label="Content"
            multiline
            rows={4}
            value={content}
            onChange={onContentChanged}
          />
        </Box>
        <Box py={1}>
          <FormControl variant="outlined">
            <Typography variant="h6">Author</Typography>
            <Select value={user} onChange={(e) => setUser(e.target.value)}>
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box py={1}>
          <Button variant="contained" color="primary" onClick={onSavePostClicked}>
            Save Post
          </Button>
        </Box>
      </form>
    </Box>
  );
}
