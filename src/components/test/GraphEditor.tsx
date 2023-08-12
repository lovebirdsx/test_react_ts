import * as React from "react";
import { GraphNode, Vector2D } from './GraphNode';
import { Button } from "theme-ui";

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
                <Button m={10} onClick={() => this.setPos(100, 0)}>Pos1</Button>
                <Button m={10} onClick={() => this.setPos(0, 100)}>Pos2</Button>
                <GraphNode pos={this.state.pos}></GraphNode>
            </div>
        );
    }
}
