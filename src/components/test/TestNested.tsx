import * as React from 'react';
import produce from 'immer';

interface ToDoListDay {
  date: string
  list: string[]
}

interface ToDoList {
  days: ToDoListDay[]
}

function ToDoListDayView(props: ToDoListDay) {
  const lists = props.list.map(e => <li><text>{e}</text></li>);
  return (
    <div>
      <text>{props.date}</text>
      {lists}
    </div>
  );
}

function ToDoListView(props: ToDoList) {
  const days = props.days.map(e => <ToDoListDayView date={e.date} list={e.list}></ToDoListDayView>)
  return (
    <div>
      {days}
    </div>
  );
}

export interface TestNestedProps {

}

interface TestNestedState {
  name: string
  todoList: ToDoList
}

export class TestNested extends React.Component<TestNestedProps, TestNestedState> {
  constructor(props: TestNestedProps) {
    super(props);
    this.state = {
      name: 'foo',
      todoList: {
        days: [
          { date: '2022-01-01', list: ['foo1', 'bar1', 'car1'] },
          { date: '2022-01-02', list: ['foo2', 'bar2', 'car2'] },
          { date: '2022-01-03', list: ['foo3', 'bar3', 'car3'] },
        ]
      }
    };
  }

  testModify = () => {
    this.setState((state, props) => {
      state.todoList.days[0].list[1] = 'modifed';
      return state
    });
  };

  testModify2 = () => {
    this.setState((state, props) => {
      return produce(state, draf => {
        draf.todoList.days[0].list[1] = 'modifed';
      });
    });
  };

  // 这里会被调用两次,由于strict mode所致,参考https://reactjs.org/docs/strict-mode.html
  testAdd = () => {
    this.setState((state, props) => {
      state.todoList.days.push({ date: '2022-01-04', list: ['foo4', 'bar4'] });
      return state;
    });
  };

  testAdd2 = () => {
    this.setState((state, props) => {
      return produce(state, draft => {
        draft.todoList.days.push({ date: '2022-01-04', list: ['foo4', 'bar4'] });
      });
    });
  };

  testDel = () => {
    this.setState((state, props) => {
      state.todoList.days.pop();
      return state;
    });
  };

  testDel2 = () => {
    this.setState((state, _) => {
      return produce(state, draft => {
        draft.todoList.days.pop();
      });
    });
  }

  render() {
    return (
      <div>
        <div>
          <div>
            <button onClick={this.testModify}>直接修改数据</button>
          </div>
          <div >
            <button onClick={this.testModify2}>新建修改数据</button>
          </div>
        </div>

        <li>
          <button onClick={this.testAdd}>直接添加数据</button>
          <button onClick={this.testAdd2}>新建添加数据</button>
        </li>
        <li>
          <button onClick={this.testDel}>直接删除数据</button>
          <button onClick={this.testDel2}>新建删除数据</button>
        </li>
        <ToDoListView days={this.state.todoList.days}></ToDoListView>
      </div>
    );
  }
}