import { 
  addDays, 
  addWeeks, 
  addMonths, 
  addYears, 
  format, 
  startOfMonth, 
  endOfMonth, 
  getDay, 
  setDate, 
  isSameMonth,
  isSameDay,
  isAfter,
  isBefore,
  startOfDay
} from 'date-fns';
import { RecurrenceRule, WeekDay } from './types';

export const WEEKDAYS: WeekDay[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export const WEEKDAY_LABELS: Record<WeekDay, string> = {
  monday: 'Mon',
  tuesday: 'Tue',
  wednesday: 'Wed',
  thursday: 'Thu',
  friday: 'Fri',
  saturday: 'Sat',
  sunday: 'Sun'
};

export const WEEKDAY_FULL_LABELS: Record<WeekDay, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday'
};

export function getWeekdayNumber(weekday: WeekDay): number {
  const mapping: Record<WeekDay, number> = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6
  };
  return mapping[weekday];
}

export function getWeekdayFromDate(date: Date): WeekDay {
  const dayNumber = getDay(date);
  const mapping: Record<number, WeekDay> = {
    0: 'sunday',
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
    6: 'saturday'
  };
  return mapping[dayNumber];
}

export function generateRecurrenceDates(rule: RecurrenceRule, maxDates: number = 50): Date[] {
  if (!rule.startDate) return [];
  
  const dates: Date[] = [];
  let currentDate = startOfDay(rule.startDate);
  const endDate = rule.endDate ? startOfDay(rule.endDate) : null;
  
  for (let i = 0; i < maxDates; i++) {
    if (endDate && isAfter(currentDate, endDate)) break;
    
    if (shouldIncludeDate(currentDate, rule)) {
      dates.push(new Date(currentDate));
    }
    
    currentDate = getNextDate(currentDate, rule, i);
  }
  
  return dates;
}

function shouldIncludeDate(date: Date, rule: RecurrenceRule): boolean {
  switch (rule.type) {
    case 'daily':
      return true;
    case 'weekly':
      if (rule.selectedDays && rule.selectedDays.length > 0) {
        const dayOfWeek = getWeekdayFromDate(date);
        return rule.selectedDays.includes(dayOfWeek);
      }
      return getWeekdayFromDate(date) === getWeekdayFromDate(rule.startDate);
    case 'monthly':
      if (rule.monthlyPattern === 'day' && rule.monthlyDayOfWeek && rule.monthlyWeekNumber) {
        return isNthWeekdayOfMonth(date, rule.monthlyDayOfWeek, rule.monthlyWeekNumber);
      }
      return date.getDate() === rule.startDate.getDate();
    case 'yearly':
      return date.getDate() === rule.startDate.getDate() && 
             date.getMonth() === rule.startDate.getMonth();
    default:
      return false;
  }
}

function getNextDate(currentDate: Date, rule: RecurrenceRule, iteration: number): Date {
  switch (rule.type) {
    case 'daily':
      return addDays(currentDate, rule.interval);
    case 'weekly':
      if (rule.selectedDays && rule.selectedDays.length > 0) {
        return getNextWeeklyDate(currentDate, rule);
      }
      return addWeeks(currentDate, rule.interval);
    case 'monthly':
      return addMonths(currentDate, rule.interval);
    case 'yearly':
      return addYears(currentDate, rule.interval);
    default:
      return addDays(currentDate, 1);
  }
}

function getNextWeeklyDate(currentDate: Date, rule: RecurrenceRule): Date {
  if (!rule.selectedDays || rule.selectedDays.length === 0) {
    return addWeeks(currentDate, rule.interval);
  }
  
  const currentDayOfWeek = getWeekdayFromDate(currentDate);
  const currentDayIndex = rule.selectedDays.indexOf(currentDayOfWeek);
  
  if (currentDayIndex === -1) {
    // Current day not in selected days, find next selected day
    const nextSelectedDay = rule.selectedDays.find(day => 
      getWeekdayNumber(day) > getWeekdayNumber(currentDayOfWeek)
    );
    
    if (nextSelectedDay) {
      const daysToAdd = getWeekdayNumber(nextSelectedDay) - getWeekdayNumber(currentDayOfWeek);
      return addDays(currentDate, daysToAdd);
    } else {
      // No more days this week, go to first selected day of next week
      const daysToNextWeek = 7 - getWeekdayNumber(currentDayOfWeek);
      const daysToFirstSelected = getWeekdayNumber(rule.selectedDays[0]);
      return addDays(currentDate, daysToNextWeek + daysToFirstSelected);
    }
  }
  
  // Current day is selected, find next selected day
  const nextIndex = currentDayIndex + 1;
  if (nextIndex < rule.selectedDays.length) {
    const nextDay = rule.selectedDays[nextIndex];
    const daysToAdd = getWeekdayNumber(nextDay) - getWeekdayNumber(currentDayOfWeek);
    return addDays(currentDate, daysToAdd);
  } else {
    // End of selected days for this week, go to next interval
    const daysToNextWeek = 7 - getWeekdayNumber(currentDayOfWeek);
    const weeksToAdd = rule.interval - 1;
    const daysToFirstSelected = getWeekdayNumber(rule.selectedDays[0]);
    return addDays(currentDate, daysToNextWeek + (weeksToAdd * 7) + daysToFirstSelected);
  }
}

function isNthWeekdayOfMonth(date: Date, weekday: WeekDay, weekNumber: number): boolean {
  const monthStart = startOfMonth(date);
  const targetWeekday = getWeekdayNumber(weekday);
  const firstWeekday = getDay(monthStart);
  
  let firstOccurrence = 1;
  if (firstWeekday <= targetWeekday) {
    firstOccurrence = 1 + (targetWeekday - firstWeekday);
  } else {
    firstOccurrence = 1 + (7 - firstWeekday + targetWeekday);
  }
  
  const nthOccurrence = firstOccurrence + (weekNumber - 1) * 7;
  return date.getDate() === nthOccurrence && isSameMonth(date, monthStart);
}

export function getOrdinalSuffix(n: number): string {
  const j = n % 10;
  const k = n % 100;
  if (j === 1 && k !== 11) return 'st';
  if (j === 2 && k !== 12) return 'nd';
  if (j === 3 && k !== 13) return 'rd';
  return 'th';
}

export function formatRecurrenceRule(rule: RecurrenceRule): string {
  if (!rule.startDate) return '';
  
  const interval = rule.interval;
  const intervalText = interval === 1 ? '' : `${interval} `;
  
  let baseText = '';
  
  switch (rule.type) {
    case 'daily':
      baseText = interval === 1 ? 'Daily' : `Every ${interval} days`;
      break;
    case 'weekly':
      if (rule.selectedDays && rule.selectedDays.length > 0) {
        const dayNames = rule.selectedDays.map(day => WEEKDAY_FULL_LABELS[day]).join(', ');
        baseText = interval === 1 ? 
          `Weekly on ${dayNames}` : 
          `Every ${interval} weeks on ${dayNames}`;
      } else {
        const dayName = WEEKDAY_FULL_LABELS[getWeekdayFromDate(rule.startDate)];
        baseText = interval === 1 ? 
          `Weekly on ${dayName}` : 
          `Every ${interval} weeks on ${dayName}`;
      }
      break;
    case 'monthly':
      if (rule.monthlyPattern === 'day' && rule.monthlyDayOfWeek && rule.monthlyWeekNumber) {
        const ordinal = `${rule.monthlyWeekNumber}${getOrdinalSuffix(rule.monthlyWeekNumber)}`;
        const dayName = WEEKDAY_FULL_LABELS[rule.monthlyDayOfWeek];
        baseText = interval === 1 ? 
          `Monthly on the ${ordinal} ${dayName}` : 
          `Every ${interval} months on the ${ordinal} ${dayName}`;
      } else {
        const date = rule.startDate.getDate();
        const ordinal = `${date}${getOrdinalSuffix(date)}`;
        baseText = interval === 1 ? 
          `Monthly on the ${ordinal}` : 
          `Every ${interval} months on the ${ordinal}`;
      }
      break;
    case 'yearly':
      const monthName = format(rule.startDate, 'MMMM');
      const date = rule.startDate.getDate();
      const ordinal = `${date}${getOrdinalSuffix(date)}`;
      baseText = interval === 1 ? 
        `Yearly on ${monthName} ${ordinal}` : 
        `Every ${interval} years on ${monthName} ${ordinal}`;
      break;
  }
  
  let dateRangeText = '';
  if (rule.startDate) {
    const startText = format(rule.startDate, 'MMM d, yyyy');
    if (rule.endDate) {
      const endText = format(rule.endDate, 'MMM d, yyyy');
      dateRangeText = ` from ${startText} to ${endText}`;
    } else {
      dateRangeText = ` starting ${startText}`;
    }
  }
  
  return baseText + dateRangeText;
}