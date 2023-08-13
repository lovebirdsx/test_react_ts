import * as React from 'react';
import { Box, Button, FormLabel } from '@mui/material';

interface ContextState {
  name: string
}

const MyContext = React.createContext<Partial<ContextState>>({})

interface TestContextState {
  contextState: ContextState;
}

export class TestContext extends React.Component<unknown, TestContextState> {
  constructor(props: unknown) {
    super(props);
    this.state = {
      contextState: {
        name: 'lovebird'
      }
    };
  }

  onChangeContext = (name: string) => {
    this.setState({
      contextState: {
        name: name
      }
    });
  }

  render() {
    return (
      <div>
        <MyContext.Provider value={this.state.contextState}>
          <Button variant='contained' sx={{ margin: 1 }} onClick={() => this.onChangeContext('name1')}>Change name1</Button>
          <Button variant='contained' sx={{ margin: 1 }} onClick={() => this.onChangeContext('name2')}>Change name2</Button>
          <ContextConsumer />
        </MyContext.Provider>
      </div>
    );
  }
}

export class ContextConsumer extends React.Component {
  static contextType = MyContext;

  render() {
    const context = this.context as ContextState;
    return (
      <Box>
        <FormLabel sx={{ fontWeight: 'bold' }}>Context = {context.name}</FormLabel>
      </Box>
    );
  }
}