import { renderHook, act } from '@testing-library/react';
import { useRecurrenceStore } from '../lib/store';

describe('useRecurrenceStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useRecurrenceStore.setState({
      rule: {
        type: 'daily',
        interval: 1,
        startDate: new Date(2024, 0, 1),
        selectedDays: [],
        monthlyPattern: 'date',
      },
      previewDates: [],
    });
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useRecurrenceStore());
    
    expect(result.current.rule.type).toBe('daily');
    expect(result.current.rule.interval).toBe(1);
    expect(result.current.rule.monthlyPattern).toBe('date');
    expect(result.current.previewDates).toHaveLength(0);
  });

  it('should update rule and preview dates', () => {
    const { result } = renderHook(() => useRecurrenceStore());
    
    act(() => {
      result.current.setRule({ type: 'weekly', interval: 2 });
    });

    expect(result.current.rule.type).toBe('weekly');
    expect(result.current.rule.interval).toBe(2);
    expect(result.current.previewDates.length).toBeGreaterThan(0);
  });

  it('should generate human readable rule', () => {
    const { result } = renderHook(() => useRecurrenceStore());
    
    act(() => {
      result.current.setRule({ 
        type: 'daily', 
        interval: 1,
        startDate: new Date(2024, 0, 1)
      });
    });

    const humanReadable = result.current.getHumanReadableRule();
    expect(humanReadable).toContain('Daily');
    expect(humanReadable).toContain('Jan 1, 2024');
  });

  it('should generate recurrence dates', () => {
    const { result } = renderHook(() => useRecurrenceStore());
    
    const rule = {
      type: 'daily' as const,
      interval: 1,
      startDate: new Date(2024, 0, 1),
    };

    const dates = result.current.generateRecurrenceDates(rule, 5);
    expect(dates).toHaveLength(5);
    expect(dates[0]).toEqual(new Date(2024, 0, 1));
  });

  it('should update preview when rule changes', () => {
    const { result } = renderHook(() => useRecurrenceStore());
    
    act(() => {
      result.current.setRule({ 
        type: 'weekly',
        startDate: new Date(2024, 0, 1),
      });
    });

    const initialPreviewLength = result.current.previewDates.length;
    expect(initialPreviewLength).toBeGreaterThan(0);

    act(() => {
      result.current.setRule({ interval: 2 });
    });

    // Preview should update when rule changes
    expect(result.current.previewDates.length).toBeGreaterThan(0);
  });
});