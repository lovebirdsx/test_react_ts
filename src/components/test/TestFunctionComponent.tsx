import * as React from 'react';
import { Box, Button, FormLabel } from '@mui/material';

function createInitialState() {
  return [
    { id: 1, name: 'Hello' },
    { id: 2, name: 'World' },
    { id: 3, name: 'Yeah' },
  ];
}

export function TestFunctionComponent() {
  const [foos, setFoos] = React.useState(createInitialState());

  const changeName = (foo: any) => {
    const newFoos = foos.map((e) => {
      if (e.id === foo.id) {
        return foo;
      }
      return e;
    });
    setFoos(newFoos);
  };

  return (
    <Box>
      {foos.map((e) => (
        <Box>
          <FormLabel key={e.id}>{e.name}</FormLabel>
          <Button
            onClick={() => {
              changeName({ id: e.id, name: 'New Name' });
            }}
          >
            Change Name
          </Button>
        </Box>
      ))}
    </Box>
  )
}
