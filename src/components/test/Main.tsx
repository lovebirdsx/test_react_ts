import container from '../../inversify.config'
import { Box, Flex, Heading, Label, Radio, Divider } from 'theme-ui'
import { ReactTestManager } from '../../common/test/ReactTestManager';
import { GraphEditor } from './GraphEditor';
import { TestContext } from './TestContext';
import { TestImmer } from './TestImmer';
import { TestNested } from './TestNested';
import { useState } from 'react';
import { Hello } from './Hello';

function registerAllTests() {
  const manager = container.resolve(ReactTestManager);
  manager.registerTest('TestHello', Hello);
  manager.registerTest('TestContext', () => <TestContext />);
  manager.registerTest('GraphEditor', () => <GraphEditor />);
  manager.registerTest('TestImmer', () => <TestImmer />);
  manager.registerTest('TestNested', () => <TestNested />);
}

function renderTestTitle(props: { name: string, select: boolean, onClick: () => void }) {
  return (
    <Label>
      <Radio name='test' value={`$props.select}`} defaultChecked={props.select} onChange={props.onClick} />
      {props.name}
    </Label>
  );
}

export function TestMain() {
  const manager = container.resolve(ReactTestManager);
  const [select, setSelect] = useState(0);

  return (
    <Box>
      <Heading as='h1'>React Test</Heading>
      <Flex>
        <Box p={20} backgroundColor={'lightgray'}>
          {manager.tests.map((e, idx) => renderTestTitle({ name: e.name, select: idx === select, onClick: () => setSelect(idx) }))}
        </Box>
        <Box p={20}>
          {manager.tests[select].render()}
        </Box>
      </Flex>
    </Box>
  );
}

registerAllTests();
