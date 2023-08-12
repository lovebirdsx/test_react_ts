import { produce } from 'immer';
import * as React from 'react';
import { Button, Heading } from 'theme-ui';

interface FooInfo {
    id: number
    name: string;
}

interface FooProps {
    foo: FooInfo
    onModify: (foo: FooInfo) => void
    onMove: (isUp: boolean) => void
}

function Foo(props: FooProps) {
    const changeName = () => {
        const foo = produce(props.foo, (draft) => {
            draft.name = 'Modifed'
        })
        props.onModify(foo)
    };

    const moveUp = () => {
        props.onMove(true);
    };

    const moveDown = () => {
        props.onMove(false);
    };

    return (
        <div>
            <Heading as='h1'>{props.foo.name}</Heading>
            <Button m={10} onClick={changeName}>Change Name</Button>
            <Button m={10} onClick={moveUp}>move up</Button>
            <Button m={10} onClick={moveDown}>move down</Button>
        </div>
    );
}

export interface TestImmerProps {

}

interface TestImmerState {
    foos: FooInfo[]
}

export class TestImmer extends React.Component<TestImmerProps, TestImmerState> {
    constructor(props: TestImmerProps) {
        super(props);
        this.state = {
            foos: [
                { id: 1, name: 'Hello' },
                { id: 2, name: 'World' },
                { id: 3, name: 'Yeah' },
            ]
        };
    }

    onModify = (foo: FooInfo) => {
        this.setState((state) => {
            return produce(state, (draft) => {
                const id = this.state.foos.findIndex(e => e.id === foo.id);
                draft.foos[id] = foo;
            });
        });
    }

    onMove = (isUp: boolean, foo: FooInfo) => {
        this.setState((state) => {
            return produce(state, (draft) => {
                const foos = this.state.foos;
                const id = foos.findIndex(e => e.id === foo.id);
                if (isUp) {
                    if (id > 0) {
                        draft.foos[id] = state.foos[id - 1];
                        draft.foos[id - 1] = state.foos[id];
                    }
                } else {
                    if (id < foos.length - 1) {
                        draft.foos[id] = state.foos[id + 1];
                        draft.foos[id + 1] = state.foos[id];
                    }
                }
            });
        });
    }

    render() {
        const foos = this.state.foos.map(e => {
            return (<Foo
                onMove={(isUp) => this.onMove(isUp, e)}
                onModify={(foo) => this.onModify(foo)}
                key={e.id}
                foo={e}
            />);
        });
        return (
            <div>
                {foos}
            </div>
        );
    }
}