import React from 'react';
import { TestMain } from './components/test/Main';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { SinglePostPage } from './features/posts/SinglePostPage';
import { PostsList } from './features/posts/PostList';
import { NavBar } from './app/Navbar';
import { EditPostForm } from './features/posts/EditPostForm';
import { Box } from '@mui/material';

export class App extends React.Component {
  render(): React.ReactNode {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path='/' Component={PostsList} />
            <Route path='/tests' Component={TestMain} />
            <Route path='/posts' Component={PostsList} />
            <Route path='/posts/:postId' Component={SinglePostPage} />
            <Route path='/editPost/:postId' Component={EditPostForm} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );
  }
}

// 测试滚动条
export function TestScroll() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Box sx={{ backgroundColor: 'primary.main', p: 2 }}>
        Banner 内容
      </Box>
      <Box sx={{ flex: 1, display: 'flex', height: 0 }}>

        <Box sx={{ flex: 1, overflowY: 'auto', height: '100%', p: 2 }}>
          <Box height={400} bgcolor={'gray'} p={2} />
        </Box>

        <Box sx={{ flex: 1, overflowY: 'auto', height: '100%', p: 2 }}>
          <Box height={800} bgcolor={'gray'} p={2} />
        </Box>

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
          <Box height={200} bgcolor={'gray'} p={2} />
          <Box sx={{ flex: 1, overflowY: 'auto', height: '100%', p: 2 }}>
            <Box height={800} bgcolor={'gray'} p={2} />
          </Box>
        </Box>

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
          <Box height={200} bgcolor={'gray'} p={2} />
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'hidden', p: 2 }}>
            <Box height={200} bgcolor={'gray'} p={2} />
            <Box sx={{ flex: 1, overflowY: 'auto', height: '100%', p: 2 }}>
              <Box height={400} bgcolor={'gray'} p={2} />
            </Box>
          </Box>
        </Box>

      </Box>
    </Box>
  );
}

export default App;
