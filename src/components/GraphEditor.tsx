import * as React from "react";
import { PersonContext } from "../App";
import { GraphNode, Vector2D } from './GraphNode';

interface State {
    pos: Vector2D;
}

export default class GraphEditor extends React.Component<any, State> {
    // 明确告知contextType
    static contextType = PersonContext;

    constructor(props: any) {
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
                <button onClick={() => this.setPos(100, 0)}>Pos1</button>
                <button onClick={() => this.setPos(0, 100)}>Pos2</button>
                <GraphNode pos={this.state.pos}></GraphNode>
                {/* 通过Consumer的方式来获得Context */}
                <PersonContext.Consumer>{({name, age, love}) => {
                    return <text>{name} age: {age}, loves {love}</text>
                }}</PersonContext.Consumer>
                <h3>This text is form context: {this.context.name} loves {this.context.love}</h3>
            </div>
        );
    }
}