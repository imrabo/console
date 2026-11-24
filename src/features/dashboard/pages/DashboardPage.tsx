'use client';

import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Check, RefreshCw, ChevronDown } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useDashboardOverview } from '../hooks/useDashboardOverview';
import type { DashboardMetric } from '../types/dashboard.types';
import { ActivityTrendChart } from '../components/ActivityTrendChart';

type DateRange = '1' | '7' | '30' | '90' | 'all' | 'custom';

const DATE_RANGE_OPTIONS: Array<{
  value: DateRange;
  label: string;
}> = [
  { value: '1', label: 'Today' },
  { value: '7', label: '7 days' },
  { value: '30', label: '30 days' },
  { value: '90', label: '90 days' },
  { value: 'all', label: 'All time' },
  { value: 'custom', label: 'Custom' },
];

const number = (value: number | null) =>
  value === null ? 'Not available' : value.toLocaleString('en-IN');

const comparison = (metric: DashboardMetric) =>
  metric.comparisonPercentage === null
    ? 'Comparison not available'
    : `${metric.comparisonPercentage >= 0 ? '+' : ''}${metric.comparisonPercentage}% vs previous period`;

function MetricCard({
  title,
  metric,
  href,
}: {
  title: string;
  metric: DashboardMetric;
  href?: string;
}) {
  const card = (
    <Card
      className={href ? 'hover:border-primary/50 hover:bg-muted/30 transition-colors' : undefined}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-muted-foreground text-sm">{title}</CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-3xl font-bold">{number(metric.value)}</p>

        <p className="text-muted-foreground mt-1 text-xs">{comparison(metric)}</p>
      </CardContent>
    </Card>
  );

  return href ? (
    <Link to={href} aria-label={`Open ${title}`}>
      {card}
    </Link>
  ) : (
    card
  );
}

export function DashboardPage() {
  const [range, setRange] = useState<DateRange>('30');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');

  const selectedRangeLabel =
    DATE_RANGE_OPTIONS.find((option) => option.value === range)?.label ?? '30 days';

  const filters = useMemo(() => {
    if (range === 'custom') {
      return {
        from: customFrom || undefined,
        to: customTo || undefined,
      };
    }

    if (range === 'all') {
      return {};
    }

    const days = Number(range);

    if (!Number.isFinite(days)) {
      return {};
    }

    const to = new Date();
    const from = new Date(to);

    from.setDate(to.getDate() - days + 1);

    return {
      from: from.toISOString().slice(0, 10),
      to: to.toISOString().slice(0, 10),
    };
  }, [customFrom, customTo, range]);

  const query = useDashboardOverview(filters);

  if (query.isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (query.isError || !query.data) {
    return (
      <div className="flex min-h-[400px] items-center justify-center p-6">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="text-destructive mx-auto mb-3" />

            <p className="font-semibold">Unable to load dashboard overview</p>

            <button
              type="button"
              className="mt-4 inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
              onClick={() => query.refetch()}
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { data } = query;

  return (
    <main className="space-y-6 p-6">
      {/* Header */}
      <header>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Overview</h1>

            <p className="text-muted-foreground text-sm">
              A truthful view of platform records for {data.range.from} to {data.range.to}.
            </p>

            <p className="text-muted-foreground text-xs">
              Last updated: {new Date(data.generatedAt).toLocaleString()}
            </p>
          </div>

          {/* Date Range */}
          <div className="flex flex-wrap items-end gap-2">
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-xs">Date range</span>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-9 min-w-[140px] items-center justify-between gap-2 rounded-md border px-3 text-sm font-medium transition-colors"
                  >
                    <span>{selectedRangeLabel}</span>

                    <ChevronDown className="text-muted-foreground h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-[180px]">
                  {DATE_RANGE_OPTIONS.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onSelect={() => setRange(option.value)}
                      className="flex cursor-pointer items-center justify-between"
                    >
                      <span>{option.label}</span>

                      {range === option.value ? <Check className="h-4 w-4" /> : null}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Custom Date Range */}
            {range === 'custom' ? (
              <>
                <label className="text-muted-foreground flex flex-col gap-1 text-xs">
                  From
                  <input
                    className="border-input bg-background text-foreground h-9 rounded-md border px-2 text-sm"
                    type="date"
                    value={customFrom}
                    onChange={(event) => setCustomFrom(event.target.value)}
                    max={customTo || undefined}
                  />
                </label>

                <label className="text-muted-foreground flex flex-col gap-1 text-xs">
                  To
                  <input
                    className="border-input bg-background text-foreground h-9 rounded-md border px-2 text-sm"
                    type="date"
                    value={customTo}
                    onChange={(event) => setCustomTo(event.target.value)}
                    min={customFrom || undefined}
                  />
                </label>
              </>
            ) : null}
          </div>
        </div>
      </header>

      {/* Summary Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard title="Users" metric={data.summary.users} href="/users" />

        <MetricCard title="Communities" metric={data.summary.communities} href="/communities" />

        <MetricCard title="Meets" metric={data.summary.meetups} href="/meets" />

        <MetricCard title="Webinars" metric={data.summary.webinars} href="/webinars" />

        <MetricCard
          title="Moderation queue"
          metric={data.summary.pendingModeration}
          href="/moderation"
        />
      </div>

      {/* Activity */}
      <Card>
        <CardHeader>
          <CardTitle>New records in selected period</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(data.activity).map(([key, value]) => (
            <MetricCard
              key={key}
              title={key.replace(/^new/, 'New ')}
              metric={value}
              href={
                {
                  newUsers: '/users',
                  newCommunities: '/communities',
                  newMeetups: '/meets',
                  newWebinars: '/webinars',
                }[key]
              }
            />
          ))}
        </CardContent>
      </Card>

      {/* Trend */}

      <ActivityTrendChart data={data.trend} />

      {/* Unavailable Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Not available from current data</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
          {['Retention', 'Revenue', 'Notifications', 'Product health'].map((label) => (
            <div key={label} className="rounded-md border p-3">
              <p className="text-muted-foreground">{label}</p>

              <p className="mt-1 font-medium">{number(null)}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}
