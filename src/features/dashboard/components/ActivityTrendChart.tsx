'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ActivityTrendPoint {
  date: string;
  users: number;
  communities: number;
  meetups: number;
  webinars: number;
}

interface ActivityTrendChartProps {
  data: ActivityTrendPoint[];
}

const formatDate = (value: string) => {
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day ?? 1);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    ...(day ? { day: 'numeric' } : {}),
    year: '2-digit',
  });
};

export function ActivityTrendChart({ data }: ActivityTrendChartProps) {
  const navigate = useNavigate();
  const [visibleSeries, setVisibleSeries] = useState<Record<string, boolean>>({
    users: true,
    communities: true,
    meetups: true,
    webinars: true,
  });
  const series = [
    { key: 'users', name: 'Users', color: 'var(--chart-1)' },
    { key: 'communities', name: 'Communities', color: 'var(--chart-2)' },
    { key: 'meetups', name: 'Meets', color: 'var(--chart-3)' },
    { key: 'webinars', name: 'Webinars', color: 'var(--chart-4)' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity in selected period</CardTitle>
      </CardHeader>

      <CardContent>
        {data.length === 0 ? (
          <p className="text-muted-foreground text-sm">No activity data available.</p>
        ) : (
          <div
            className="h-[360px] w-full cursor-pointer"
            role="link"
            tabIndex={0}
            aria-label="View daily user activity"
            onClick={() => navigate('/dashboard/user-activity')}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                navigate('/dashboard/user-activity');
              }
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{
                  top: 10,
                  right: 20,
                  left: 0,
                  bottom: 10,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />

                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  interval="preserveStartEnd"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  className="text-xs"
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                  tickMargin={10}
                  className="text-xs"
                />

                <Tooltip
                  labelFormatter={(value) => formatDate(String(value))}
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid hsl(var(--border))',
                    backgroundColor: 'hsl(var(--background))',
                  }}
                />

                <Legend
                  content={() => (
                    <div className="flex flex-wrap justify-center gap-3 pt-3">
                      {series.map(({ key, name, color }) => (
                        <button
                          key={key}
                          type="button"
                          aria-pressed={visibleSeries[key]}
                          onClick={(event) => {
                            event.stopPropagation();
                            setVisibleSeries((current) => ({ ...current, [key]: !current[key] }));
                          }
                          }
                          className={`inline-flex items-center gap-2 text-xs ${visibleSeries[key] ? '' : 'opacity-40'}`}
                        >
                          <span
                            className="size-2 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                          {name}
                        </button>
                      ))}
                    </div>
                  )}
                />

                {series.map(({ key, name, color }) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    name={name}
                    stroke={color}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 5 }}
                    hide={!visibleSeries[key]}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
