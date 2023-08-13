import { Box, FormLabel } from '@mui/material';
import * as React from 'react';

export interface Vector2D {
  X: number;
  Y: number;
}

export interface GraphNodeProps {
  pos: Vector2D
}

interface GraphNodeState {
  text: string,
}

export class GraphNode extends React.Component<GraphNodeProps, GraphNodeState> {
  constructor(props: GraphNodeProps) {
    super(props);
    this.state = {
      text: 'Node'
    };
  }

  render() {
    return (
      <Box>
        <Box>
          <FormLabel sx={{ fontWeight: 'bold' }}>X = {this.props.pos.X}</FormLabel>
        </Box>
        <Box>
          <FormLabel sx={{ fontWeight: 'bold' }}>Y = {this.props.pos.Y}</FormLabel>
        </Box>
      </Box>
    );
  }
}
