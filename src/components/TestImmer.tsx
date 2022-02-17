import produce from 'immer';
import * as React from 'react';

interface FooInfo {
    id: number
    name: string;
}

interface FooProps  {
    foo: FooInfo
    onModify: (foo: FooInfo) => void
}

function Foo(props: FooProps) {
    return (
        <div>
            <h2>{props.foo.name}</h2>
            <button onClick={
                () => {
                    const foo = produce(props.foo, (draft) => {
                        draft.name = 'Modifed'
                    })
                    props.onModify(foo)
                }
            }>Change Name</button>
        </div>
    );
}

export interface TestImmerProps {
    
}

interface TestImmerState {
    foos: FooInfo []
}

export class TestImmer extends React.Component<TestImmerProps, TestImmerState> {
    constructor(props: TestImmerProps) {
        super(props);
        this.state = {
            foos: [
                {id: 1, name: 'Hello'},
                {id: 2, name: 'World'},
                {id: 3, name: 'Yeah'},
            ]
        };
    }

    onModify= (foo: FooInfo) => {
        this.setState((state) => {
            return produce(state, (draft) => {
                const id = this.state.foos.findIndex(e => e.id === foo.id);
                draft.foos[id] = foo;
            });
        });
    }

    render() {
        const foos = this.state.foos.map(e => {
            return (<Foo
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