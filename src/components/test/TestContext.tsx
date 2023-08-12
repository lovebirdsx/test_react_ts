import * as React from 'react';

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
                <MyContext.Provider value = {this.state.contextState}>
                    <button className='btn btn-block btn-lg btn-primary' onClick={() => this.onChangeContext('name1')}>Change name1</button>
                    <button className='btn btn-block btn-lg btn-primary' onClick={() => this.onChangeContext('name2')}>Change name2</button>
                    <ContextConsumer></ContextConsumer>
                </MyContext.Provider>
            </div>
        );
    }
}

export class ContextConsumer extends React.Component<any, any> {
    static contextType = MyContext;
    constructor(props: any) {
        super(props);
        this.state = {
        };
    }

    render() {
        const context: ContextState = this.context;
        return (
            <div>
                <h1>Context = {context.name}</h1>
            </div>
        );
    }
}