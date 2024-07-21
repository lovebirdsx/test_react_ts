import * as React from 'react';
import { produce } from 'immer';
import { Box, Button, Checkbox, FormControlLabel, FormGroup, FormLabel } from '@mui/material';
import { nanoid } from '@reduxjs/toolkit';

interface ToDoListDay {
  id: string;
  date: string;
  list: string[];
}

interface ToDoList {
  days: ToDoListDay[];
}

function ToDoListDayView(props: ToDoListDay) {
  const lists = props.list.map((e) => <FormControlLabel key={e} control={<Checkbox />} label={e} />);
  return (
    <Box>
      <FormLabel sx={{ fontWeight: 'bold' }}>{props.date}</FormLabel>
      <FormGroup>{lists}</FormGroup>
    </Box>
  );
}

function ToDoListView(props: ToDoList) {
  const days = props.days.map((e) => <ToDoListDayView key={e.id} {...e}></ToDoListDayView>);
  return <Box sx={{ marginLeft: 1 }}>{days}</Box>;
}

interface TestNestedState {
  name: string;
  todoList: ToDoList;
}

export class TestNested extends React.Component<unknown, TestNestedState> {
  constructor(props: unknown) {
    super(props);
    this.state = {
      name: 'foo',
      todoList: {
        days: [
          { id: '1', date: '2022-01-01', list: ['foo1', 'bar1', 'car1'] },
          { id: '2', date: '2022-01-02', list: ['foo2', 'bar2', 'car2'] },
          { id: '3', date: '2022-01-03', list: ['foo3', 'bar3', 'car3'] },
        ],
      },
    };
  }

  testModify = () => {
    this.setState((state, props) => {
      state.todoList.days[0].list[1] = 'modifed';
      return state;
    });
  };

  testModify2 = () => {
    this.setState((state, props) => {
      return produce(state, (draf) => {
        draf.todoList.days[0].list[1] = 'modifed';
      });
    });
  };

  // 这里会被调用两次,由于strict mode所致,参考https://reactjs.org/docs/strict-mode.html
  testAdd = () => {
    this.setState((state, props) => {
      state.todoList.days.push({ id: nanoid(), date: '2022-01-04', list: ['foo4', 'bar4'] });
      return state;
    });
  };

  testAdd2 = () => {
    this.setState((state, props) => {
      return produce(state, (draft) => {
        draft.todoList.days.push({ id: nanoid(), date: '2022-01-04', list: ['foo4', 'bar4'] });
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
      return produce(state, (draft) => {
        draft.todoList.days.pop();
      });
    });
  };

  render() {
    return (
      <div>
        <Box>
          <Button variant="contained" sx={{ margin: 1 }} onClick={this.testModify}>
            直接修改
          </Button>
          <Button variant="contained" sx={{ margin: 1 }} onClick={this.testModify2}>
            新建修改
          </Button>
        </Box>

        <Box>
          <Button variant="contained" sx={{ margin: 1 }} onClick={this.testAdd}>
            直接添加
          </Button>
          <Button variant="contained" sx={{ margin: 1 }} onClick={this.testAdd2}>
            新建添加
          </Button>
        </Box>

        <Box>
          <Button variant="contained" sx={{ margin: 1 }} onClick={this.testDel}>
            直接删除
          </Button>
          <Button variant="contained" sx={{ margin: 1 }} onClick={this.testDel2}>
            新建删除
          </Button>
        </Box>
        <ToDoListView days={this.state.todoList.days}></ToDoListView>
      </div>
    );
  }
}
