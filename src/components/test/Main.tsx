import { Box, FormControlLabel, Grid, Radio, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import container from '../../inversify.config';
import { ReactTestManager } from '../../common/test/ReactTestManager';
import { GraphEditor } from './GraphEditor';
import { TestContext } from './TestContext';
import { TestImmer } from './TestImmer';
import { TestNested } from './TestNested';
import { Hello } from './Hello';
import { Counter } from '../../features/counter/Counter';
import { CounterWrapped } from '../../features/counter/Counter2';
import { TestFunctionComponent } from './TestFunctionComponent';
import { TestSchema } from './TestSchema';
import { TestSetState } from './TestSetState';
import { TestDecorator } from './TestDecorator';
import { TestInput } from './TestInput';
import { TestMultiEdit } from './TestMultiEdit';
import { TestArray } from './TestArray';
import { TestContextMenu } from './TestContextMenu';
import { TestClassProps } from './TestClassProps';
import { TestJsonPath } from './TestJsonPath';
import { TestReactSelect } from './TestReactSelect';
import { TestPeekComponent } from './TestPeekComponent';
import { TestSelect } from './TestSelect';
import { TestReactWindow } from './TestReactWindow';
import { TestTree } from './TestTree';
import { TestVsplay } from './testVsplay/TestService';
import { TestSelectorEfficiency } from './TestSelector';

function registerAllTests() {
  const manager = container.resolve(ReactTestManager);
  manager.registerTest('TestHello', () => <Hello />);
  manager.registerTest('TestContext', () => <TestContext />);
  manager.registerTest('GraphEditor', () => <GraphEditor />);
  manager.registerTest('TestImmer', () => <TestImmer />);
  manager.registerTest('TestNested', () => <TestNested />);
  manager.registerTest('Counter', () => <Counter />);
  manager.registerTest('Counter2', () => <CounterWrapped />);
  manager.registerTest('TestFunctionComponent', () => <TestFunctionComponent />);
  manager.registerTest('TestSchema', () => <TestSchema />);
  manager.registerTest('TestSetState', () => <TestSetState />);
  manager.registerTest('TestDecorator', () => <TestDecorator />);
  manager.registerTest('TestInput', () => <TestInput />);
  manager.registerTest('TestMultiEdit', () => <TestMultiEdit />);
  manager.registerTest('TestContextMenu', () => <TestContextMenu />);
  manager.registerTest('TestClassProps', () => <TestClassProps />);
  manager.registerTest('TestArray', () => <TestArray />);
  manager.registerTest('TestJsonPath', () => <TestJsonPath />);
  manager.registerTest('TestReactSelect', () => <TestReactSelect />);
  manager.registerTest('TestPeekComponent', () => <TestPeekComponent />);
  manager.registerTest('TestSelect', () => <TestSelect />);
  manager.registerTest('TestReactWindow', () => <TestReactWindow />);
  manager.registerTest('TestTree', () => <TestTree />);
  manager.registerTest('TestService', () => <TestVsplay />);
  manager.registerTest('TestSelectorEfficiency', () => <TestSelectorEfficiency />);
}

function renderTestTitle(props: { name: string; select: boolean; onClick: () => void }) {
  return (
    <Grid key={props.name}>
      <FormControlLabel
        value={props.name}
        label={props.name}
        control={<Radio name="test" checked={props.select} onChange={props.onClick} />}
      />
    </Grid>
  );
}

export function TestMain() {
  const manager = container.resolve(ReactTestManager);
  const initialTestId = parseInt(localStorage.getItem('testId') || '0', 10);
  const [testId, setTestId] = useState(initialTestId);

  useEffect(() => {
    localStorage.setItem('testId', testId.toString());
  }, [testId]);

  return (
    <Box p={2}>
      <Typography variant="h2">React Test</Typography>
      <Box py={2}>
        <Grid container p={2} bgcolor={'lightgray'}>
          {manager.tests.map((e, idx) =>
            renderTestTitle({
              name: e.name,
              select: idx === testId,
              onClick: () => {
                setTestId(idx);
              },
            }),
          )}
        </Grid>
        <Box p={2}>{manager.tests[testId].render()}</Box>
      </Box>
    </Box>
  );
}

registerAllTests();
