'use client';

import { useRecurrenceStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function CalendarPreview() {
  const { previewDates } = useRecurrenceStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => 
      direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1)
    );
  };

  const isRecurringDate = (date: Date) => {
    return previewDates.some(previewDate => isSameDay(previewDate, date));
  };

  const getRecurringDatesInMonth = () => {
    return previewDates.filter(date => isSameMonth(date, currentMonth));
  };

  const recurringDatesInMonth = getRecurringDatesInMonth();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Calendar Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('prev')}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-semibold">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('next')}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
              {day}
            </div>
          ))}
          
          {/* Days */}
          {daysInMonth.map(date => (
            <div
              key={date.toISOString()}
              className={cn(
                'aspect-square flex items-center justify-center text-sm rounded-md transition-colors',
                isRecurringDate(date) 
                  ? 'bg-primary text-primary-foreground font-medium' 
                  : 'hover:bg-muted',
                !isSameMonth(date, currentMonth) && 'text-muted-foreground'
              )}
            >
              {format(date, 'd')}
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="text-sm text-muted-foreground">
          <p className="font-medium">
            {recurringDatesInMonth.length} recurring date(s) in {format(currentMonth, 'MMMM yyyy')}
          </p>
          {recurringDatesInMonth.length > 0 && (
            <div className="mt-2 space-y-1">
              {recurringDatesInMonth.slice(0, 5).map(date => (
                <div key={date.toISOString()} className="text-xs">
                  {format(date, 'EEE, MMM d')}
                </div>
              ))}
              {recurringDatesInMonth.length > 5 && (
                <div className="text-xs text-muted-foreground">
                  +{recurringDatesInMonth.length - 5} more...
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}