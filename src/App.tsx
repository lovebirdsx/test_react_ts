import React from 'react';
import { TestMain } from './components/test/Main';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { SinglePostPage } from './features/posts/SinglePostPage';
import { PostsList } from './features/posts/PostList';

class App extends React.Component {
  render(): React.ReactNode {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Switch>
            <Route exact path='/' component={PostsList} />
            <Route exact path='/tests' component={TestMain} />
            <Route exact path='/posts' component={PostsList} />
            <Route exact path='/posts/:postId' component={SinglePostPage} />
          </Switch>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
