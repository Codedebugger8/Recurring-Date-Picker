'use client';

import { useRecurrenceStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar, X } from 'lucide-react';
import { format } from 'date-fns';

export function DateRangePicker() {
  const { rule, setRule } = useRecurrenceStore();

  const handleStartDateChange = (dateString: string) => {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      setRule({ startDate: date });
    }
  };

  const handleEndDateChange = (dateString: string) => {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      setRule({ endDate: date });
    }
  };

  const clearEndDate = () => {
    setRule({ endDate: undefined });
  };

  const formatDateForInput = (date: Date) => {
    return format(date, 'yyyy-MM-dd');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Date Range
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="start-date">Start Date</Label>
          <Input
            id="start-date"
            type="date"
            value={formatDateForInput(rule.startDate)}
            onChange={(e) => handleStartDateChange(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="end-date">End Date (Optional)</Label>
            {rule.endDate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearEndDate}
                className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Input
            id="end-date"
            type="date"
            value={rule.endDate ? formatDateForInput(rule.endDate) : ''}
            onChange={(e) => handleEndDateChange(e.target.value)}
            min={formatDateForInput(rule.startDate)}
            className="w-full"
          />
        </div>

        <div className="text-sm text-muted-foreground">
          {rule.endDate ? (
            <p>
              Duration: {format(rule.startDate, 'MMM d, yyyy')} -{' '}
              {format(rule.endDate, 'MMM d, yyyy')}
            </p>
          ) : (
            <p>No end date - recurrence continues indefinitely</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}