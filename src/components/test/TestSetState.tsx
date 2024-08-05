import React, { Component } from 'react';
import { useConfirm } from 'material-ui-confirm';

interface IState {
  isShowing: boolean;
}

export class TestSetState1 extends Component<unknown, IState> {
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
        <p>测试SetState</p>
        <button onClick={() => this.setState({ isShowing: false })}>{'Hide'}</button>
        <button onClick={() => this.setState({ isShowing: true })}>{'Show'}</button>
        <button onClick={() => this.setState({ isShowing: !this.state.isShowing })}>
          {this.state.isShowing ? 'Hide' : 'Show'}
        </button>
        {this.state.isShowing && <div>Content</div>}
      </div>
    );
  }
}

// 修正后的 RenderData 组件
function RenderData(props: { IsChecked: boolean; OnModify: (isChecked: boolean) => void }): JSX.Element {
  return <input type="checkbox" checked={props.IsChecked} onChange={(e) => props.OnModify(e.target.checked)} />;
}

// 使用 useState 和 useEffect 进行状态管理
function RenderCancelOnModify(): JSX.Element {
  const [isChecked, setIsChecked] = React.useState(false);
  const confirm = useConfirm();
  const onModify = (newCheck: boolean): void => {
    confirm({
      title: '提示',
      content: '是否修改',
    })
      .then(() => {
        setIsChecked(newCheck);
      })
      .catch(() => {
        //
      });
  };

  return (
    <div>
      <p>截取控件的改变消息，根据用户选择来决定是否更新</p>
      <RenderData IsChecked={isChecked} OnModify={onModify} />
    </div>
  );
}

export function TestSetState() {
  return (
    <div>
      <TestSetState1 />
      <RenderCancelOnModify />
    </div>
  );
}
