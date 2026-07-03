import { useGetDashboardStats } from '@workspace/api-client-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCircle, Newspaper, Megaphone, Calendar as CalendarIcon, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const { data: stats, isLoading } = useGetDashboardStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-serif font-bold">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-[400px] lg:col-span-2 rounded-xl" />
          <Skeleton className="h-[400px] rounded-xl" />
        </div>
      </div>
    );
  }

  const chartData = stats?.studentsByGrade.map(g => ({
    name: `Grade ${g.grade}`,
    students: g.count
  })) || [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome to the BNHS Admin Portal. Here's an overview of the system.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-primary hover-elevate transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalStudents || 0}</div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-secondary hover-elevate transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Personnel</CardTitle>
            <UserCircle className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalPersonnel || 0}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-chart-3 hover-elevate transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">News Articles</CardTitle>
            <Newspaper className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalNews || 0}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-chart-4 hover-elevate transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Announcements</CardTitle>
            <Megaphone className="h-4 w-4 text-chart-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalAnnouncements || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader>
            <CardTitle>Students by Grade Level</CardTitle>
            <CardDescription>Current enrollment distribution</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip 
                  cursor={{ fill: 'hsl(var(--muted))' }}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                />
                <Bar dataKey="students" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Next 30 days</CardDescription>
            </div>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/admin/events"><ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="flex-1">
            {stats?.upcomingEvents && stats.upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {stats.upcomingEvents.slice(0, 5).map(event => (
                  <div key={event.id} className="flex gap-4 items-start border-b border-border/50 pb-4 last:border-0 last:pb-0">
                    <div className="bg-primary/10 text-primary rounded-lg p-2 text-center min-w-14 shrink-0">
                      <div className="text-xs font-bold uppercase">{format(new Date(event.startDate), 'MMM')}</div>
                      <div className="text-lg font-bold leading-none">{format(new Date(event.startDate), 'dd')}</div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm line-clamp-1">{event.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        {format(new Date(event.startDate), 'h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground py-8">
                <CalendarIcon className="h-10 w-10 mb-2 opacity-20" />
                <p>No upcoming events</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent News */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Recent News</CardTitle>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/news">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {stats?.recentNews && stats.recentNews.length > 0 ? (
              <div className="space-y-4">
                {stats.recentNews.slice(0, 4).map(news => (
                  <div key={news.id} className="flex gap-3 items-center">
                    <div className="h-12 w-16 bg-muted rounded overflow-hidden shrink-0 flex items-center justify-center">
                      {news.coverImage ? (
                        <img src={news.coverImage} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <Newspaper className="h-5 w-5 text-muted-foreground/50" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">{news.title}</h4>
                      <p className="text-xs text-muted-foreground">{format(new Date(news.publishedAt), 'MMM dd, yyyy')} • {news.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">No recent news</div>
            )}
          </CardContent>
        </Card>

        {/* Recent Announcements */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Recent Announcements</CardTitle>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/announcements">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {stats?.recentAnnouncements && stats.recentAnnouncements.length > 0 ? (
              <div className="space-y-4">
                {stats.recentAnnouncements.slice(0, 4).map(ann => (
                  <div key={ann.id} className="flex gap-3 items-start">
                    <div className={`mt-0.5 shrink-0 ${ann.isEmergency ? 'text-destructive' : 'text-primary'}`}>
                      <Megaphone className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-medium truncate ${ann.isEmergency ? 'text-destructive' : ''}`}>{ann.title}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-1">{ann.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">No recent announcements</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}