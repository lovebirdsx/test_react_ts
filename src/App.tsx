import React from 'react';
import { TestMain } from './components/test/Main';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { SinglePostPage } from './features/posts/SinglePostPage';
import { PostsList } from './features/posts/PostList';
import { NavBar } from './app/Navbar';
import { EditPostForm } from './features/posts/EditPostForm';

class App extends React.Component {
  render(): React.ReactNode {
    return (
      <Provider store={store}>
        <BrowserRouter>
        <NavBar />
          <Routes>
            <Route path='/'  Component={PostsList} />
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

export default App;
