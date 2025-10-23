import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Header with TypeScript title', () => {
  render(<App />);
  const heading = screen.getByRole('heading', { name: 'TypeScript' });
  expect(heading).toBeInTheDocument();
});
