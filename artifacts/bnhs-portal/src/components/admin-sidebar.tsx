import { useAuth } from '@/contexts/auth-context';
import { useLogout } from '@workspace/api-client-react';
import { Link, useLocation } from 'wouter';
import { ThemeToggle } from './theme-toggle';
import bnhsLogo from '../assets/bnhs-logo.png';
import { 
  LayoutDashboard, 
  Users, 
  UserCircle, 
  Newspaper, 
  Megaphone, 
  CalendarDays, 
  FileDown, 
  Image as ImageIcon,
  Flag,
  UserPlus,
  Info,
  Settings,
  LogOut,
  Menu
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar';

function AppSidebar() {
  const [location] = useLocation();
  const { user, setUser } = useAuth();
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      setUser(null);
    } catch (e) {
      console.error('Logout failed', e);
    }
  };

  const navGroups = [
    {
      label: 'Main',
      items: [
        { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
        { title: 'Students', url: '/admin/students', icon: Users },
        { title: 'Personnel', url: '/admin/personnel', icon: UserCircle },
      ]
    },
    {
      label: 'Content',
      items: [
        { title: 'News', url: '/admin/news', icon: Newspaper },
        { title: 'Announcements', url: '/admin/announcements', icon: Megaphone },
        { title: 'Events', url: '/admin/events', icon: CalendarDays },
        { title: 'Downloads', url: '/admin/downloads', icon: FileDown },
        { title: 'Gallery', url: '/admin/gallery', icon: ImageIcon },
      ]
    },
    {
      label: 'Organizations',
      items: [
        { title: 'SSLG', url: '/admin/sslg', icon: Flag },
        { title: 'PTA', url: '/admin/pta', icon: Users },
      ]
    },
    {
      label: 'System',
      items: [
        { title: 'About Page', url: '/admin/about', icon: Info },
        ...(user?.role === 'admin' ? [{ title: 'Users', url: '/admin/users', icon: Settings }] : [])
      ]
    }
  ];

  return (
    <Sidebar variant="inset" className="border-r shadow-sm">
      <SidebarHeader className="bg-sidebar">
        <div className="flex items-center gap-3 p-2">
          <div className="bg-white rounded-md p-1 h-10 w-10 flex items-center justify-center shrink-0">
            <img src={bnhsLogo} alt="BNHS Logo" className="h-8 w-8 object-contain" />
          </div>
          <div className="flex flex-col truncate">
            <span className="font-bold text-sidebar-foreground truncate">BNHS Portal</span>
            <span className="text-xs text-sidebar-foreground/70 truncate">Admin Dashboard</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={location === item.url || (item.url !== '/admin' && location.startsWith(item.url))}
                      tooltip={item.title}
                    >
                      <Link href={item.url} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border bg-sidebar p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-9 w-9 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-bold shrink-0">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium text-sidebar-foreground truncate">{user?.name}</span>
            <span className="text-xs text-sidebar-foreground/70 truncate capitalize">{user?.role}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <SidebarMenuButton asChild onClick={handleLogout} className="text-destructive hover:text-destructive w-auto flex-1 justify-center bg-background/10 hover:bg-background/20">
            <button className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </button>
          </SidebarMenuButton>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-muted/30 w-full flex">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="h-14 border-b bg-background flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-2">
                  <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-semibold">View Public Site</span>
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 lg:p-6 lg:pb-12">
            <div className="mx-auto max-w-6xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}