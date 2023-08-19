import { render, screen } from '@testing-library/react';
import App from './App';

test('renders post title', () => {
  render(<App />);
  const post = screen.getByText(/Posts/i);
  expect(post).toBeInTheDocument();
});
