import { create } from 'zustand';
import { RecurrenceState, RecurrenceRule } from './types';
import { generateRecurrenceDates, formatRecurrenceRule } from './dateUtils';

export const useRecurrenceStore = create<RecurrenceState>((set, get) => ({
  rule: {
    type: 'daily',
    interval: 1,
    startDate: new Date(),
    selectedDays: [],
    monthlyPattern: 'date',
  },
  previewDates: [],
  
  setRule: (newRule: Partial<RecurrenceRule>) => {
    set((state) => {
      const updatedRule = { ...state.rule, ...newRule };
      const previewDates = generateRecurrenceDates(updatedRule, 50);
      return {
        rule: updatedRule,
        previewDates,
      };
    });
  },
  
  updatePreview: () => {
    const { rule } = get();
    const previewDates = generateRecurrenceDates(rule, 50);
    set({ previewDates });
  },
  
  generateRecurrenceDates: (rule: RecurrenceRule, maxDates = 50) => {
    return generateRecurrenceDates(rule, maxDates);
  },
  
  getHumanReadableRule: () => {
    const { rule } = get();
    return formatRecurrenceRule(rule);
  },
}));