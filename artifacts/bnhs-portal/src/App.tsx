import { Route, Switch, Router as WouterRouter } from 'wouter';
import { AuthProvider } from '@/contexts/auth-context';
import { ProtectedRoute } from '@/components/protected-route';
import { PublicLayout } from '@/layouts/public-layout';
import NotFound from '@/pages/not-found';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from 'next-themes';

// Admin Pages
import AdminLogin from '@/pages/admin/login';
import AdminDashboard from '@/pages/admin/dashboard';
import AdminStudents from '@/pages/admin/students';
import AdminPersonnel from '@/pages/admin/personnel';
import AdminNews from '@/pages/admin/news';
import AdminAnnouncements from '@/pages/admin/announcements';
import AdminEvents from '@/pages/admin/events';
import AdminDownloads from '@/pages/admin/downloads';
import AdminGallery from '@/pages/admin/gallery';
import AdminSSLG from '@/pages/admin/sslg';
import AdminPTA from '@/pages/admin/pta';
import AdminAbout from '@/pages/admin/about';
import AdminUsers from '@/pages/admin/users';

// Public Pages
import Home from '@/pages/public/home';
import About from '@/pages/public/about';
import Personnel from '@/pages/public/personnel';
import News from '@/pages/public/news';
import NewsDetail from '@/pages/public/news-detail';
import Downloads from '@/pages/public/downloads';
import Gallery from '@/pages/public/gallery';
import Contact from '@/pages/public/contact';
import SSLG from '@/pages/public/sslg';
import PTA from '@/pages/public/pta';

const queryClient = new QueryClient();

function PublicRoutes() {
  return (
    <PublicLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/personnel" component={Personnel} />
        <Route path="/sslg" component={SSLG} />
        <Route path="/pta" component={PTA} />
        <Route path="/news" component={News} />
        <Route path="/news/:id" component={NewsDetail} />
        <Route path="/downloads" component={Downloads} />
        <Route path="/gallery" component={Gallery} />
        <Route path="/contact" component={Contact} />
        <Route component={NotFound} />
      </Switch>
    </PublicLayout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/admin/login" component={AdminLogin} />
      
      {/* Protected Admin Routes */}
      <Route path="/admin" component={() => <ProtectedRoute component={AdminDashboard} />} />
      <Route path="/admin/students" component={() => <ProtectedRoute component={AdminStudents} />} />
      <Route path="/admin/personnel" component={() => <ProtectedRoute component={AdminPersonnel} />} />
      <Route path="/admin/news" component={() => <ProtectedRoute component={AdminNews} />} />
      <Route path="/admin/announcements" component={() => <ProtectedRoute component={AdminAnnouncements} />} />
      <Route path="/admin/events" component={() => <ProtectedRoute component={AdminEvents} />} />
      <Route path="/admin/downloads" component={() => <ProtectedRoute component={AdminDownloads} />} />
      <Route path="/admin/gallery" component={() => <ProtectedRoute component={AdminGallery} />} />
      <Route path="/admin/sslg" component={() => <ProtectedRoute component={AdminSSLG} />} />
      <Route path="/admin/pta" component={() => <ProtectedRoute component={AdminPTA} />} />
      <Route path="/admin/about" component={() => <ProtectedRoute component={AdminAbout} />} />
      <Route path="/admin/users" component={() => <ProtectedRoute component={AdminUsers} />} />
      
      {/* Fallback to Public Routes */}
      <Route path="*" component={PublicRoutes} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL?.replace(/\/$/, '') || ''}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;