import { Grid } from '@mui/material';
import { Link } from 'react-router-dom';

export function NavBar() {
  return (
    <Grid container p={1}>
      <Grid item px={1}>
        <Link to="/">Home</Link>
      </Grid>
      <Grid item px={1}>
        <Link to="/Tests">Tests</Link>
      </Grid>
    </Grid>
  );
}
