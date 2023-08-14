import container from '../../inversify.config'
import { Box, FormControlLabel, Radio, Typography } from '@mui/material'
import { ReactTestManager } from '../../common/test/ReactTestManager';
import { GraphEditor } from './GraphEditor';
import { TestContext } from './TestContext';
import { TestImmer } from './TestImmer';
import { TestNested } from './TestNested';
import { useState } from 'react';
import { Hello } from './Hello';
import { Counter } from '../../features/counter/Counter';

function registerAllTests() {
  const manager = container.resolve(ReactTestManager);
  manager.registerTest('TestHello', () => <Hello/>);
  manager.registerTest('TestContext', () => <TestContext />);
  manager.registerTest('GraphEditor', () => <GraphEditor />);
  manager.registerTest('TestImmer', () => <TestImmer />);
  manager.registerTest('TestNested', () => <TestNested />);
  manager.registerTest('Counter', () => <Counter />);
}

function renderTestTitle(props: { name: string, select: boolean, onClick: () => void }) {
  return (
    <FormControlLabel value={props.name} label={props.name} control={
      <Radio name='test' checked={props.select} defaultChecked={props.select} onChange={props.onClick} />
    } />
  );
}

export function TestMain() {
  const manager = container.resolve(ReactTestManager);
  const [select, setSelect] = useState(0);

  return (
    <Box p={2}>
      <Typography variant='h2'>React Test</Typography>
      <Box py={2}>
        <Box p={2} bgcolor={'lightgray'}>
          {manager.tests.map((e, idx) => renderTestTitle({ name: e.name, select: idx === select, onClick: () => setSelect(idx) }))}
        </Box>
        <Box p={2}>
          {manager.tests[select].render()}
        </Box>
      </Box>
    </Box>
  );
}

registerAllTests();
