import { Box, Button, Typography } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../../app/hook';
import { selectCount, increment, decrement } from './counterSlice';

export function Counter() {
  const count = useAppSelector(selectCount);
  const dispatch = useAppDispatch();
  return (
    <Box>
      <Typography variant='h2'>Count: {count}</Typography>
      <Box>
        <Button variant='contained' sx={{ margin: 1 }} onClick={() => dispatch(increment())}>+</Button>
        <Button variant='contained' sx={{ margin: 1 }} onClick={() => dispatch(decrement())}>-</Button>
      </Box>
    </Box>
  );
}