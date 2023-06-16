/* eslint-disable testing-library/no-debugging-utils */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

test('renders correct search message', async () => {
  render(<App />);

  let message = screen.getByText('Searches for ...');
  expect(message).toBeInTheDocument();

  const textInput = screen.getByRole('textbox');
  await userEvent.type(textInput, 'Taylor Swift');
  message = screen.getByText('Searches for Taylor Swift');
  expect(message).toBeInTheDocument();
});
