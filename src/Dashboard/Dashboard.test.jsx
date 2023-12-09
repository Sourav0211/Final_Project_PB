import React from 'react';
import { render, fireEvent, waitFor ,screen } from '@testing-library/react';
import Dashboard from './Dashboard';

jest.mock('../Dashboard/Dashboard.css', () => ({}));
jest.mock('../Menu/Menu.css', () => ({}));
jest.mock('axios');

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: [] }), // Adjust the response as needed
  })
);

describe('Dashboard Component', () => {
    it('should create budget successfully and display the message', async () => {
      const mockAuthUser = { uid: 'mockUserId', email: 'test@example.com' };
      const mockUserSignOut = jest.fn();
  
      render(<Dashboard authUser={mockAuthUser} userSignOut={mockUserSignOut} />);
  
      const budgetValue = 1000;
      const expenseValue = 500;
  
    
      const budgetInput = screen.getByLabelText(/Budget/i);
      const expenseInput = screen.getByLabelText(/Expense/i);
  
      fireEvent.change(budgetInput, { target: { value: budgetValue } });
      fireEvent.change(expenseInput, { target: { value: expenseValue } });
  
      jest.useFakeTimers();
  

      fireEvent.click(screen.getByText(/enter/i));
  
    
      await waitFor(() => {
       
        expect(screen.getByText(/new data added/i)).toBeInTheDocument();
      });
  
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/budget/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            month: 'January',
            category: 'Food',
          value: budgetValue,
          value2: expenseValue,
        }),
      });
  
      // Verify that setTimeout was called
      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 3000);
  
      // Verify that the message is displayed
      expect(screen.getByText(/new data added/i)).toBeInTheDocument();
  
      // Verify that userSignOut was not called
      expect(mockUserSignOut).not.toHaveBeenCalled();
  
      // Clean up the fake timers
      jest.useRealTimers();
    });
  });