import { Box, FormControlLabel, Grid, Radio, Typography } from "@mui/material";
import { useState } from "react";
import container from "../../inversify.config";
import { ReactTestManager } from "../../common/test/ReactTestManager";
import { GraphEditor } from "./GraphEditor";
import { TestContext } from "./TestContext";
import { TestImmer } from "./TestImmer";
import { TestNested } from "./TestNested";
import { Hello } from "./Hello";
import { Counter } from "../../features/counter/Counter";
import { CounterWrapped } from "../../features/counter/Counter2";
import { TestFunctionComponent } from "./TestFunctionComponent";
import { TestSchema } from "./TestSchema";

function registerAllTests() {
  const manager = container.resolve(ReactTestManager);
  manager.registerTest("TestHello", () => <Hello />);
  manager.registerTest("TestContext", () => <TestContext />);
  manager.registerTest("GraphEditor", () => <GraphEditor />);
  manager.registerTest("TestImmer", () => <TestImmer />);
  manager.registerTest("TestNested", () => <TestNested />);
  manager.registerTest("Counter", () => <Counter />);
  manager.registerTest("Counter2", () => <CounterWrapped />);
  manager.registerTest("TestFunctionComponent", () => (
    <TestFunctionComponent />
  ));
  manager.registerTest("TestSchema", () => <TestSchema />);
}

function renderTestTitle(props: {
  name: string;
  select: boolean;
  onClick: () => void;
}) {
  return (
    <Grid key={props.name}>
      <FormControlLabel
        value={props.name}
        label={props.name}
        control={
          <Radio name="test" checked={props.select} onChange={props.onClick} />
        }
      />
    </Grid>
  );
}

export function TestMain() {
  const manager = container.resolve(ReactTestManager);
  const [select, setSelect] = useState(0);

  return (
    <Box p={2}>
      <Typography variant="h2">React Test</Typography>
      <Box py={2}>
        <Grid container p={2} bgcolor={"lightgray"}>
          {manager.tests.map((e, idx) =>
            renderTestTitle({
              name: e.name,
              select: idx === select,
              onClick: () => setSelect(idx),
            }),
          )}
        </Grid>
        <Box p={2}>{manager.tests[select].render()}</Box>
      </Box>
    </Box>
  );
}

registerAllTests();
