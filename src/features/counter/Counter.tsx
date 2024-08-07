import { Box, Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hook';
import { selectCount, increment, decrement, incrementByAmount, incrementAsync } from './counterSlice';

export function Counter() {
  const [amount, changeAmount] = useState(2);
  const count = useAppSelector(selectCount);
  const dispatch = useAppDispatch();
  return (
    <Box>
      <Box display="flex" p={1}>
        <Button variant="contained" sx={{ margin: 1 }} onClick={() => dispatch(decrement())}>
          -
        </Button>
        <Typography variant="h3">{count}</Typography>
        <Button variant="contained" sx={{ margin: 1 }} onClick={() => dispatch(increment())}>
          +
        </Button>
      </Box>
      <Box display="flex" p={1}>
        <TextField
          type="number"
          label="Amount"
          value={amount}
          onChange={(e) => changeAmount(parseInt(e.target.value, 10))}
        />
        <Button variant="contained" sx={{ margin: 1 }} onClick={() => dispatch(incrementByAmount(amount))}>
          Add Amount
        </Button>
        <Button variant="contained" sx={{ margin: 1 }} onClick={() => dispatch(incrementAsync(5))}>
          Add Sync
        </Button>
      </Box>
    </Box>
  );
}
