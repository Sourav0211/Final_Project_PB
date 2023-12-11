
import React from 'react';
import Login from './Login.jsx';
import { render , fireEvent, screen} from '@testing-library/react';
jest.mock('./Login.css', () => ({}));
jest.mock('../Dashboard/Dashboard.css', () => ({}));
jest.mock('../Menu/Menu.css', () => ({}));
jest.mock('axios');

describe('Login', () => {
  it('triggers onFormSwitch with "register" argument when button is clicked', () => {
    const onFormSwitchMock = jest.fn(); 

    render(<Login onFormSwitch={onFormSwitchMock} />);
    const button = screen.getByRole('button', { name: /register/i });

    fireEvent.click(button);

    expect(onFormSwitchMock).toHaveBeenCalledWith('register');
  });
});


