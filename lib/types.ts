export type RecurrenceType = 'daily' | 'weekly' | 'monthly' | 'yearly';

export type WeekDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export type MonthlyPattern = 'date' | 'day';

export interface RecurrenceRule {
  type: RecurrenceType;
  interval: number;
  startDate: Date;
  endDate?: Date;
  selectedDays?: WeekDay[];
  monthlyPattern?: MonthlyPattern;
  monthlyWeekNumber?: number;
  monthlyDayOfWeek?: WeekDay;
}

export interface RecurrenceState {
  rule: RecurrenceRule;
  previewDates: Date[];
  setRule: (rule: Partial<RecurrenceRule>) => void;
  updatePreview: () => void;
  generateRecurrenceDates: (rule: RecurrenceRule, maxDates?: number) => Date[];
  getHumanReadableRule: () => string;
}