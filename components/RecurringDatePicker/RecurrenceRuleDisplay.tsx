'use client';

import { useRecurrenceStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';

export function RecurrenceRuleDisplay() {
  const { rule, previewDates, getHumanReadableRule } = useRecurrenceStore();
  const [copied, setCopied] = useState(false);

  const humanReadableRule = getHumanReadableRule();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(humanReadableRule);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const getNextOccurrences = () => {
    const now = new Date();
    return previewDates
      .filter(date => date >= now)
      .slice(0, 5);
  };

  const nextOccurrences = getNextOccurrences();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Recurrence Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Human-readable rule */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Rule</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="h-6 px-2"
            >
              {copied ? (
                <Check className="h-3 w-3 text-green-600" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
            {humanReadableRule || 'Configure your recurrence settings'}
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Total Occurrences</p>
            <Badge variant="secondary">
              {rule.endDate ? previewDates.length : `${previewDates.length}+`}
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Interval</p>
            <Badge variant="outline">
              Every {rule.interval} {rule.type === 'daily' ? 'day' : 
                                     rule.type === 'weekly' ? 'week' : 
                                     rule.type === 'monthly' ? 'month' : 'year'}
              {rule.interval > 1 ? 's' : ''}
            </Badge>
          </div>
        </div>

        {/* Next occurrences */}
        {nextOccurrences.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Next Occurrences</h4>
            <div className="space-y-1">
              {nextOccurrences.map(date => (
                <div key={date.toISOString()} className="text-sm text-muted-foreground">
                  {format(date, 'EEE, MMM d, yyyy')}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional info */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>Start: {format(rule.startDate, 'MMM d, yyyy')}</p>
          {rule.endDate && <p>End: {format(rule.endDate, 'MMM d, yyyy')}</p>}
        </div>
      </CardContent>
    </Card>
  );
}