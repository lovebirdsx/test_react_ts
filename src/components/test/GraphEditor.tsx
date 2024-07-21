import * as React from 'react';
import { Box, Button } from '@mui/material';
import { GraphNode, Vector2D } from './GraphNode';

interface State {
  pos: Vector2D;
}

export class GraphEditor extends React.Component<unknown, State> {
  constructor(props: unknown) {
    super(props);
    this.state = {
      pos: { X: 0, Y: 0 },
    };
  }

  setPos = (x: number, y: number) => {
    this.setState({ pos: { X: x, Y: y } });
    console.log('setPos', x, y);
  };

  render() {
    return (
      <div>
        <Button variant="contained" sx={{ margin: 1 }} onClick={() => this.setPos(100, 0)}>
          Pos1
        </Button>
        <Button variant="contained" sx={{ margin: 1 }} onClick={() => this.setPos(0, 100)}>
          Pos2
        </Button>
        <Box margin={1}>
          <GraphNode pos={this.state.pos}></GraphNode>
        </Box>
      </div>
    );
  }
}
