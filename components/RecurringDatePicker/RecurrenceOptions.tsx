'use client';

import { useRecurrenceStore } from '@/lib/store';
import { RecurrenceType, WeekDay, MonthlyPattern } from '@/lib/types';
import { WEEKDAYS, WEEKDAY_LABELS, getWeekdayFromDate } from '@/lib/dateUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';

export function RecurrenceOptions() {
  const { rule, setRule } = useRecurrenceStore();

  const handleRecurrenceTypeChange = (type: RecurrenceType) => {
    const updates: any = { type };
    
    // Set default values based on type
    if (type === 'weekly' && !rule.selectedDays?.length) {
      updates.selectedDays = [getWeekdayFromDate(rule.startDate)];
    } else if (type === 'monthly' && !rule.monthlyPattern) {
      updates.monthlyPattern = 'date';
    }
    
    setRule(updates);
  };

  const handleIntervalChange = (interval: number) => {
    if (interval > 0) {
      setRule({ interval });
    }
  };

  const handleWeekdayToggle = (weekday: WeekDay, checked: boolean) => {
    const currentDays = rule.selectedDays || [];
    const newDays = checked 
      ? [...currentDays, weekday]
      : currentDays.filter(day => day !== weekday);
    
    setRule({ selectedDays: newDays });
  };

  const handleMonthlyPatternChange = (pattern: MonthlyPattern) => {
    const updates: any = { monthlyPattern: pattern };
    
    if (pattern === 'day') {
      // Set default to first Monday of month
      updates.monthlyWeekNumber = 1;
      updates.monthlyDayOfWeek = 'monday';
    }
    
    setRule(updates);
  };

  const selectAllWeekdays = () => {
    setRule({ selectedDays: [...WEEKDAYS] });
  };

  const clearAllWeekdays = () => {
    setRule({ selectedDays: [] });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recurrence Options</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Recurrence Type */}
        <div className="space-y-2">
          <Label>Recurrence Type</Label>
          <Select value={rule.type} onValueChange={handleRecurrenceTypeChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Interval */}
        <div className="space-y-2">
          <Label>
            Every{' '}
            <span className="text-muted-foreground">
              ({rule.type === 'daily' ? 'days' : 
                rule.type === 'weekly' ? 'weeks' : 
                rule.type === 'monthly' ? 'months' : 'years'})
            </span>
          </Label>
          <Input
            type="number"
            min="1"
            max="365"
            value={rule.interval}
            onChange={(e) => handleIntervalChange(parseInt(e.target.value))}
            className="w-20"
          />
        </div>

        {/* Weekly Options */}
        {rule.type === 'weekly' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Days of the Week</Label>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={selectAllWeekdays}
                  disabled={rule.selectedDays?.length === 7}
                >
                  All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllWeekdays}
                  disabled={!rule.selectedDays?.length}
                >
                  Clear
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {WEEKDAYS.map((weekday) => (
                <div key={weekday} className="flex flex-col items-center space-y-2">
                  <Label className="text-xs">{WEEKDAY_LABELS[weekday]}</Label>
                  <Checkbox
                    checked={rule.selectedDays?.includes(weekday) || false}
                    onCheckedChange={(checked) => 
                      handleWeekdayToggle(weekday, checked as boolean)
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Monthly Options */}
        {rule.type === 'monthly' && (
          <div className="space-y-4">
            <Label>Monthly Pattern</Label>
            <RadioGroup 
              value={rule.monthlyPattern} 
              onValueChange={handleMonthlyPatternChange}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="date" id="date" />
                <Label htmlFor="date">On the same date each month</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="day" id="day" />
                <Label htmlFor="day">On a specific day of the month</Label>
              </div>
            </RadioGroup>

            {rule.monthlyPattern === 'day' && (
              <div className="flex space-x-2">
                <Select
                  value={rule.monthlyWeekNumber?.toString()}
                  onValueChange={(value) => 
                    setRule({ monthlyWeekNumber: parseInt(value) })
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">First</SelectItem>
                    <SelectItem value="2">Second</SelectItem>
                    <SelectItem value="3">Third</SelectItem>
                    <SelectItem value="4">Fourth</SelectItem>
                    <SelectItem value="5">Last</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={rule.monthlyDayOfWeek}
                  onValueChange={(value) => 
                    setRule({ monthlyDayOfWeek: value as WeekDay })
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {WEEKDAYS.map((weekday) => (
                      <SelectItem key={weekday} value={weekday}>
                        {weekday.charAt(0).toUpperCase() + weekday.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}