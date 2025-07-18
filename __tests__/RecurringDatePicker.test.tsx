import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecurringDatePicker } from '../components/RecurringDatePicker';

// Mock the store
jest.mock('../lib/store', () => ({
  useRecurrenceStore: () => ({
    rule: {
      type: 'daily',
      interval: 1,
      startDate: new Date(2024, 0, 1),
      selectedDays: [],
      monthlyPattern: 'date',
    },
    previewDates: [
      new Date(2024, 0, 1),
      new Date(2024, 0, 2),
      new Date(2024, 0, 3),
    ],
    setRule: jest.fn(),
    getHumanReadableRule: () => 'Daily starting Jan 1, 2024',
  }),
}));

describe('RecurringDatePicker Integration', () => {
  it('should render all main components', () => {
    render(<RecurringDatePicker />);
    
    expect(screen.getByText('Recurring Date Picker')).toBeInTheDocument();
    expect(screen.getByText('Recurrence Options')).toBeInTheDocument();
    expect(screen.getByText('Date Range')).toBeInTheDocument();
    expect(screen.getByText('Calendar Preview')).toBeInTheDocument();
    expect(screen.getByText('Recurrence Summary')).toBeInTheDocument();
  });

  it('should display the human readable rule', () => {
    render(<RecurringDatePicker />);
    
    expect(screen.getByText('Daily starting Jan 1, 2024')).toBeInTheDocument();
  });

  it('should show recurrence type options', () => {
    render(<RecurringDatePicker />);
    
    // Check if the select trigger is present
    const selectTrigger = screen.getByRole('combobox');
    expect(selectTrigger).toBeInTheDocument();
  });

  it('should display date inputs', () => {
    render(<RecurringDatePicker />);
    
    const startDateInput = screen.getByLabelText('Start Date');
    const endDateInput = screen.getByLabelText('End Date (Optional)');
    
    expect(startDateInput).toBeInTheDocument();
    expect(endDateInput).toBeInTheDocument();
  });

  it('should show calendar preview with navigation', () => {
    render(<RecurringDatePicker />);
    
    const prevButton = screen.getByRole('button', { name: /previous/i });
    const nextButton = screen.getByRole('button', { name: /next/i });
    
    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  it('should display preview statistics', () => {
    render(<RecurringDatePicker />);
    
    expect(screen.getByText('Total Occurrences')).toBeInTheDocument();
    expect(screen.getByText('Interval')).toBeInTheDocument();
  });

  it('should handle user interaction', async () => {
    const user = userEvent.setup();
    render(<RecurringDatePicker />);
    
    const intervalInput = screen.getByDisplayValue('1');
    await user.clear(intervalInput);
    await user.type(intervalInput, '2');
    
    expect(intervalInput).toHaveValue(2);
  });
});