import * as React from "react";
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
        console.log('setPos', x, y)
    }

    render() {
        return (
            <div>
                <button className='btn btn-block btn-lg btn-primary' onClick={() => this.setPos(100, 0)}>Pos1</button>
                <button className='btn btn-block btn-lg btn-primary' onClick={() => this.setPos(0, 100)}>Pos2</button>
                <GraphNode pos={this.state.pos}></GraphNode>
                <h3>This text is form context: {this.context.name} loves {this.context.love}</h3>
            </div>
        );
    }
}
