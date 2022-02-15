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
            <div>
                <h3>{JSON.stringify(this.props.pos)}</h3>
            </div>
        );
    }
}
