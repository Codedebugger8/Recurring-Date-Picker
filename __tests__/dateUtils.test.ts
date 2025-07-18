import { 
  generateRecurrenceDates, 
  getWeekdayFromDate, 
  formatRecurrenceRule,
  getOrdinalSuffix 
} from '../lib/dateUtils';
import { RecurrenceRule } from '../lib/types';

describe('dateUtils', () => {
  describe('getWeekdayFromDate', () => {
    it('should return correct weekday for known dates', () => {
      // Monday, January 1, 2024
      const monday = new Date(2024, 0, 1);
      expect(getWeekdayFromDate(monday)).toBe('monday');
      
      // Sunday, January 7, 2024
      const sunday = new Date(2024, 0, 7);
      expect(getWeekdayFromDate(sunday)).toBe('sunday');
    });
  });

  describe('getOrdinalSuffix', () => {
    it('should return correct ordinal suffixes', () => {
      expect(getOrdinalSuffix(1)).toBe('st');
      expect(getOrdinalSuffix(2)).toBe('nd');
      expect(getOrdinalSuffix(3)).toBe('rd');
      expect(getOrdinalSuffix(4)).toBe('th');
      expect(getOrdinalSuffix(11)).toBe('th');
      expect(getOrdinalSuffix(21)).toBe('st');
      expect(getOrdinalSuffix(22)).toBe('nd');
      expect(getOrdinalSuffix(23)).toBe('rd');
    });
  });

  describe('generateRecurrenceDates', () => {
    const startDate = new Date(2024, 0, 1); // January 1, 2024 (Monday)

    it('should generate daily recurrence dates', () => {
      const rule: RecurrenceRule = {
        type: 'daily',
        interval: 1,
        startDate,
      };

      const dates = generateRecurrenceDates(rule, 5);
      expect(dates).toHaveLength(5);
      expect(dates[0]).toEqual(startDate);
      expect(dates[1]).toEqual(new Date(2024, 0, 2));
      expect(dates[4]).toEqual(new Date(2024, 0, 5));
    });

    it('should generate daily recurrence with interval', () => {
      const rule: RecurrenceRule = {
        type: 'daily',
        interval: 2,
        startDate,
      };

      const dates = generateRecurrenceDates(rule, 3);
      expect(dates).toHaveLength(3);
      expect(dates[0]).toEqual(startDate);
      expect(dates[1]).toEqual(new Date(2024, 0, 3));
      expect(dates[2]).toEqual(new Date(2024, 0, 5));
    });

    it('should generate weekly recurrence dates', () => {
      const rule: RecurrenceRule = {
        type: 'weekly',
        interval: 1,
        startDate,
      };

      const dates = generateRecurrenceDates(rule, 3);
      expect(dates).toHaveLength(3);
      expect(dates[0]).toEqual(startDate);
      expect(dates[1]).toEqual(new Date(2024, 0, 8));
      expect(dates[2]).toEqual(new Date(2024, 0, 15));
    });

    it('should generate weekly recurrence with selected days', () => {
      const rule: RecurrenceRule = {
        type: 'weekly',
        interval: 1,
        startDate,
        selectedDays: ['monday', 'friday'],
      };

      const dates = generateRecurrenceDates(rule, 4);
      expect(dates).toHaveLength(4);
      expect(dates[0]).toEqual(startDate); // Monday
      expect(dates[1]).toEqual(new Date(2024, 0, 5)); // Friday
      expect(dates[2]).toEqual(new Date(2024, 0, 8)); // Next Monday
      expect(dates[3]).toEqual(new Date(2024, 0, 12)); // Next Friday
    });

    it('should generate monthly recurrence dates', () => {
      const rule: RecurrenceRule = {
        type: 'monthly',
        interval: 1,
        startDate,
      };

      const dates = generateRecurrenceDates(rule, 3);
      expect(dates).toHaveLength(3);
      expect(dates[0]).toEqual(startDate);
      expect(dates[1]).toEqual(new Date(2024, 1, 1)); // February 1
      expect(dates[2]).toEqual(new Date(2024, 2, 1)); // March 1
    });

    it('should generate yearly recurrence dates', () => {
      const rule: RecurrenceRule = {
        type: 'yearly',
        interval: 1,
        startDate,
      };

      const dates = generateRecurrenceDates(rule, 3);
      expect(dates).toHaveLength(3);
      expect(dates[0]).toEqual(startDate);
      expect(dates[1]).toEqual(new Date(2025, 0, 1));
      expect(dates[2]).toEqual(new Date(2026, 0, 1));
    });

    it('should respect end date', () => {
      const rule: RecurrenceRule = {
        type: 'daily',
        interval: 1,
        startDate,
        endDate: new Date(2024, 0, 3),
      };

      const dates = generateRecurrenceDates(rule, 10);
      expect(dates).toHaveLength(3);
      expect(dates[2]).toEqual(new Date(2024, 0, 3));
    });
  });

  describe('formatRecurrenceRule', () => {
    const startDate = new Date(2024, 0, 1);

    it('should format daily recurrence', () => {
      const rule: RecurrenceRule = {
        type: 'daily',
        interval: 1,
        startDate,
      };

      expect(formatRecurrenceRule(rule)).toBe('Daily starting Jan 1, 2024');
    });

    it('should format weekly recurrence', () => {
      const rule: RecurrenceRule = {
        type: 'weekly',
        interval: 2,
        startDate,
      };

      expect(formatRecurrenceRule(rule)).toBe('Every 2 weeks on Monday starting Jan 1, 2024');
    });

    it('should format monthly recurrence with date pattern', () => {
      const rule: RecurrenceRule = {
        type: 'monthly',
        interval: 1,
        startDate,
        monthlyPattern: 'date',
      };

      expect(formatRecurrenceRule(rule)).toBe('Monthly on the 1st starting Jan 1, 2024');
    });

    it('should format monthly recurrence with day pattern', () => {
      const rule: RecurrenceRule = {
        type: 'monthly',
        interval: 1,
        startDate,
        monthlyPattern: 'day',
        monthlyWeekNumber: 2,
        monthlyDayOfWeek: 'tuesday',
      };

      expect(formatRecurrenceRule(rule)).toBe('Monthly on the 2nd Tuesday starting Jan 1, 2024');
    });

    it('should format yearly recurrence', () => {
      const rule: RecurrenceRule = {
        type: 'yearly',
        interval: 1,
        startDate,
      };

      expect(formatRecurrenceRule(rule)).toBe('Yearly on January 1st starting Jan 1, 2024');
    });

    it('should include end date in format', () => {
      const rule: RecurrenceRule = {
        type: 'daily',
        interval: 1,
        startDate,
        endDate: new Date(2024, 0, 31),
      };

      expect(formatRecurrenceRule(rule)).toBe('Daily from Jan 1, 2024 to Jan 31, 2024');
    });
  });
});