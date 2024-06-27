import { Component } from "react";

interface IState {
  isShowing: boolean;
}

export class TestSetState extends Component<unknown, IState> {
  constructor(props: unknown) {
    super(props);
    this.state = {
      isShowing: false,
    };
  }

  render() {
    console.log(`TestSetState render ${this.state.isShowing}`);

    return (
      <div>
        <button onClick={() => this.setState({ isShowing: false })}>
          {"Hide"}
        </button>
        <button onClick={() => this.setState({ isShowing: true })}>
          {"Show"}
        </button>
        <button
          onClick={() => this.setState({ isShowing: !this.state.isShowing })}
        >
          {this.state.isShowing ? "Hide" : "Show"}
        </button>
        {this.state.isShowing && <div>Content</div>}
      </div>
    );
  }
}
