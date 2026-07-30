import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { Users, Home, MapPin, AlertTriangle, Coins, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { COLLECTIONS } from '@/lib/constants/COLLECTIONS';

// Quick query keys
const dashboardStatsQueryKey = ['dashboard', 'stats'];

export const DashboardPage: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: dashboardStatsQueryKey,
    queryFn: async () => {
      // API-backed dashboard queries have not yet been implemented. Keep the
      // dashboard renderable with explicit empty collections in the meantime.
      const [users, communities, meetups, webinars, reports] = await Promise.all([
        Promise.resolve<any[]>([]),
        Promise.resolve<any[]>([]),
        Promise.resolve<any[]>([]),
        Promise.resolve<any[]>([]),
        Promise.resolve<any[]>([]),
      ]);

      const activeUsers = users.filter((u: any) => u.status === 'Active').length;
      const totalCoins = users.reduce((acc: number, curr: any) => acc + (curr.coins || 0), 0);

      return {
        totalUsers: users.length,
        activeUsers,
        totalCommunities: communities.length,

        totalMeetups: meetups.length,
        totalWebinars: webinars.length,
        pendingReports: reports.filter((r: any) => r.status === 'Pending').length,
        totalCoins,
        recentReports: reports.slice(0, 5),
      };
    },
  });

  if (isLoading) return <Spinner />;
  if (error || !data) {
    toast.error('Failed to load dashboard metrics');
    return <div className="text-destructive p-6">Error loading dashboard stats</div>;
  }

  // Pre-configured chart data
  const registrationTrend = [
    { name: 'Jan', registrations: 34, meetups: 8 },
    { name: 'Feb', registrations: 45, meetups: 12 },
    { name: 'Mar', registrations: 58, meetups: 15 },
    { name: 'Apr', registrations: 72, meetups: 19 },
    { name: 'May', registrations: 95, meetups: 26 },
    { name: 'Jun', registrations: 120, meetups: 32 },
  ];

  const categoryBreakdown = [
    { category: 'Playdate', count: 18 },
    { category: 'Educational', count: 12 },
    { category: 'Support Group', count: 8 },
    { category: 'Sports', count: 4 },
  ];

  return (
    <div className="animate-fade-in space-y-8 p-6">
      {/* Welcome Banner */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-white shadow-xl shadow-indigo-500/10 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">HUGGED Dashboard</h1>
          <p className="mt-1 font-medium text-white/80">
            Here is what is happening across your parenting community today.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
          <TrendingUp className="h-5 w-5" />
          <span className="text-sm font-semibold">Platform Health: Excellent</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card/50 border-border/50 shadow-md backdrop-blur-md transition-all duration-200 hover:scale-102 hover:shadow-indigo-500/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
              Total Users
            </CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
              <Users className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold tracking-tight">{data.totalUsers}</div>
            <p className="text-muted-foreground mt-1 text-xs">
              <span className="font-semibold text-emerald-500">{data.activeUsers} Active</span> (
              {Math.round((data.activeUsers / data.totalUsers) * 100)}%)
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50 shadow-md backdrop-blur-md transition-all duration-200 hover:scale-102 hover:shadow-purple-500/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
              Total Communities
            </CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
              <Home className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold tracking-tight">{data.totalCommunities}</div>
            <p className="text-muted-foreground mt-1 text-xs">
              <span className="font-semibold text-purple-500">
                {data.totalCommunities} Communities
              </span>{' '}
              linked
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50 shadow-md backdrop-blur-md transition-all duration-200 hover:scale-102 hover:shadow-amber-500/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
              Meetups & Webinars
            </CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <MapPin className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold tracking-tight">
              {data.totalMeetups + data.totalWebinars}
            </div>
            <p className="text-muted-foreground mt-1 text-xs">
              <span className="font-semibold text-amber-500">{data.totalMeetups} local</span> /{' '}
              {data.totalWebinars} online
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50 shadow-md backdrop-blur-md transition-all duration-200 hover:scale-102 hover:shadow-rose-500/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
              Pending Reports
            </CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold tracking-tight text-rose-500">
              {data.pendingReports}
            </div>
            <p className="text-muted-foreground mt-1 text-xs">Requires moderator actions</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="bg-card/50 border-border/50 p-4 shadow-md backdrop-blur-md lg:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold">Community Growth & Engagement</CardTitle>
            <CardDescription>
              Monthly registrations compared with local meetup organizing activity
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={registrationTrend}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorMeet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="registrations"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorReg)"
                  name="New Users"
                />
                <Area
                  type="monotone"
                  dataKey="meetups"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorMeet)"
                  name="Meetups Scheduled"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50 p-4 shadow-md backdrop-blur-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold">Meetups by Category</CardTitle>
            <CardDescription>Breakdown of organized community activities</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryBreakdown}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <XAxis
                  dataKey="category"
                  stroke="#888888"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#a855f7" radius={[4, 4, 0, 0]} name="Meetups Count" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Moderation Alerts List */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-card/50 border-border/50 shadow-md backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-bold">
              <AlertTriangle className="h-5 w-5 text-rose-500" /> Recent Pending Reports
            </CardTitle>
            <CardDescription>Immediate reviews required from Moderation team</CardDescription>
          </CardHeader>
          <CardContent>
            {data.recentReports.length === 0 ? (
              <div className="text-muted-foreground py-6 text-center text-sm font-medium">
                All clear! No pending moderation reports.
              </div>
            ) : (
              <div className="divide-border/60 divide-y">
                {data.recentReports.map((report: any) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-rose-500/10 px-2 py-0.5 text-xs font-bold tracking-wider text-rose-500 uppercase">
                          {report.reportedType}
                        </span>
                        <span className="text-foreground text-sm font-semibold">
                          {report.reason}
                        </span>
                      </div>
                      <p className="text-muted-foreground line-clamp-1 text-xs italic">
                        &quot;{report.reportedContent}&quot;
                      </p>
                    </div>
                    <div className="text-muted-foreground text-right text-xs">
                      <p>By {report.reporterName}</p>
                      <p className="mt-0.5 text-[10px]">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
