'use client';

import { RecurrenceOptions } from './RecurrenceOptions';
import { DateRangePicker } from './DateRangePicker';
import { CalendarPreview } from './CalendarPreview';
import { RecurrenceRuleDisplay } from './RecurrenceRuleDisplay';

export function RecurringDatePicker() {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Recurring Date Picker</h1>
        <p className="text-muted-foreground mt-2">
          Configure recurring dates with flexible patterns and preview the results
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column - Configuration */}
        <div className="space-y-6">
          <RecurrenceOptions />
          <DateRangePicker />
        </div>

        {/* Right Column - Preview and Summary */}
        <div className="space-y-6">
          <RecurrenceRuleDisplay />
          <CalendarPreview />
        </div>
      </div>
    </div>
  );
}