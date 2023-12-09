
import React from 'react';
import Login from './Login.jsx';
import { render , fireEvent, screen} from '@testing-library/react';
jest.mock('./Login.css', () => ({}));
jest.mock('../Dashboard/Dashboard.css', () => ({}));
jest.mock('../Menu/Menu.css', () => ({}));
jest.mock('axios');

describe('Login', () => {
  it('triggers onFormSwitch with "register" argument when button is clicked', () => {
    const onFormSwitchMock = jest.fn(); // Mock the onFormSwitch function

    render(<Login onFormSwitch={onFormSwitchMock} />);

    // Use getByRole to select the button by its role
    const button = screen.getByRole('button', { name: /register/i });

    fireEvent.click(button);

    // Check if onFormSwitch was called with the correct argument
    expect(onFormSwitchMock).toHaveBeenCalledWith('register');
  });
});


