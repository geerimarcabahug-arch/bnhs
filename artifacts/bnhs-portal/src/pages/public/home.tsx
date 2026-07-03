import { useListNews, useListAnnouncements, useListEvents, useGetAbout, useGetDashboardStats } from '@workspace/api-client-react';
import { Link } from 'wouter';
import { format } from 'date-fns';
import { ArrowRight, Calendar, ChevronRight, FileText, Megaphone, Users, Award, BookOpen } from 'lucide-react';
import heroImg from '../../assets/hero-school.png';

export default function Home() {
  const { data: newsData } = useListNews({ limit: 3 });
  const { data: annData } = useListAnnouncements({ limit: 5 });
  const { data: eventsData } = useListEvents({ upcoming: true });
  const { data: aboutData } = useGetAbout();

  const emergencyAnnouncements = annData?.data?.filter(a => a.isEmergency) || [];
  const regularAnnouncements = annData?.data?.filter(a => !a.isEmergency) || [];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Emergency Banner */}
      {emergencyAnnouncements.length > 0 && (
        <div className="bg-destructive text-destructive-foreground py-3 px-4 shadow-md z-10 relative">
          <div className="container mx-auto flex flex-col sm:flex-row items-center gap-4 justify-center">
            <div className="flex items-center gap-2 font-bold shrink-0">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
              EMERGENCY ALERT
            </div>
            <div className="text-sm font-medium text-center sm:text-left flex-1 max-w-3xl truncate">
              {emergencyAnnouncements[0].title}: {emergencyAnnouncements[0].content}
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroImg} alt="Burgos National High School Campus" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-white flex flex-col items-start animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <span className="inline-block py-1 px-3 rounded-full bg-secondary/90 text-secondary-foreground text-sm font-bold tracking-wider mb-6 border border-secondary">
            WELCOME TO BNHS
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold leading-tight max-w-4xl drop-shadow-lg">
            Empowering Minds,<br />
            <span className="text-secondary">Shaping the Future</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl max-w-2xl text-white/90 leading-relaxed font-medium drop-shadow-md">
            Dedicated to providing quality education, fostering character development, and building a stronger community for the youth of Burgos.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/about" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-4 rounded-md font-bold transition-all hover:scale-105 hover:shadow-lg inline-flex items-center gap-2">
              Discover Our School <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="/contact" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-md font-bold transition-all inline-flex items-center">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Links / Highlights */}
      <section className="relative -mt-16 z-20 container mx-auto px-4 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border shadow-xl rounded-xl p-8 hover-elevate transition-all group border-t-4 border-t-primary">
            <div className="bg-primary/10 text-primary h-14 w-14 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BookOpen className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-serif font-bold mb-3">Academic Excellence</h3>
            <p className="text-muted-foreground mb-6 line-clamp-3">Comprehensive curriculum designed to prepare students for higher education and future careers.</p>
            <Link href="/about" className="text-primary font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              Learn more <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="bg-card border shadow-xl rounded-xl p-8 hover-elevate transition-all group border-t-4 border-t-secondary">
            <div className="bg-secondary/20 text-secondary-foreground h-14 w-14 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-serif font-bold mb-3">Student Life</h3>
            <p className="text-muted-foreground mb-6 line-clamp-3">Vibrant campus community with active student organizations and extracurricular activities.</p>
            <Link href="/sslg" className="text-primary font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              Explore SSLG <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="bg-card border shadow-xl rounded-xl p-8 hover-elevate transition-all group border-t-4 border-t-chart-3">
            <div className="bg-chart-3/10 text-chart-3 h-14 w-14 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Award className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-serif font-bold mb-3">Community Partner</h3>
            <p className="text-muted-foreground mb-6 line-clamp-3">Strong collaboration with parents and local stakeholders to support student development.</p>
            <Link href="/pta" className="text-primary font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              Join the PTA <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Two Column Layout: News/Principal & Sidebar */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-16">
            
            {/* Principal's Message */}
            {aboutData?.principalMessage && (
              <div className="bg-primary/5 rounded-2xl p-8 md:p-10 border border-primary/10">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-full md:w-1/3 shrink-0">
                    <div className="aspect-square bg-muted rounded-xl overflow-hidden mb-4 border-4 border-white shadow-md">
                      {/* Placeholder for Principal Photo */}
                      <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                        <Users className="h-16 w-16 text-primary/40" />
                      </div>
                    </div>
                    <h3 className="font-serif font-bold text-xl">{aboutData.principalName || 'School Principal'}</h3>
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider mt-1">School Principal</p>
                  </div>
                  <div className="flex-1 space-y-4">
                    <h2 className="text-3xl font-serif font-bold text-primary">Principal's Welcome</h2>
                    <div className="prose prose-sm md:prose-base dark:prose-invert text-muted-foreground">
                      <p className="italic text-lg text-foreground/80 border-l-4 border-secondary pl-4 py-1">
                        "{aboutData.principalMessage.split('\n')[0]}"
                      </p>
                      <p className="line-clamp-6 mt-4">
                        {aboutData.principalMessage.split('\n').slice(1).join(' ')}
                      </p>
                    </div>
                    <Link href="/about" className="inline-block mt-4 text-primary font-semibold hover:underline">
                      Read full message
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Latest News */}
            <div>
              <div className="flex items-end justify-between mb-8 border-b pb-4">
                <div>
                  <h2 className="text-3xl font-serif font-bold">Latest News</h2>
                  <p className="text-muted-foreground mt-2">Updates and stories from our campus</p>
                </div>
                <Link href="/news" className="hidden sm:flex items-center gap-2 text-primary font-medium hover:underline">
                  View all news <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {newsData?.data?.map((news) => (
                  <Link key={news.id} href={`/news/${news.id}`} className="group flex flex-col bg-card rounded-xl border overflow-hidden shadow-sm hover:shadow-md transition-all">
                    <div className="aspect-video bg-muted relative overflow-hidden">
                      {news.coverImage ? (
                        <img src={news.coverImage} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary/20">
                          <FileText className="h-12 w-12" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3 bg-secondary text-secondary-foreground text-xs font-bold px-2.5 py-1 rounded">
                        {news.category}
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="text-xs text-muted-foreground mb-3 flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5" />
                        {format(new Date(news.publishedAt), 'MMMM d, yyyy')}
                      </div>
                      <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">{news.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                        {news.excerpt || news.content.substring(0, 150) + '...'}
                      </p>
                      <span className="text-sm font-semibold text-primary inline-flex items-center gap-1 group-hover:gap-2 transition-all mt-auto">
                        Read article <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-6 sm:hidden">
                <Link href="/news" className="flex items-center justify-center w-full py-3 bg-muted rounded-md text-primary font-medium">
                  View all news
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            
            {/* Announcements Board */}
            <div className="bg-card border shadow-sm rounded-xl overflow-hidden">
              <div className="bg-primary p-4 text-primary-foreground flex items-center gap-3">
                <Megaphone className="h-5 w-5 text-secondary" />
                <h3 className="font-serif font-bold text-lg">Announcements</h3>
              </div>
              <div className="p-0">
                {regularAnnouncements.length > 0 ? (
                  <ul className="divide-y">
                    {regularAnnouncements.map((ann) => (
                      <li key={ann.id} className="p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="bg-primary/10 rounded p-2 text-primary shrink-0 mt-0.5">
                            <Megaphone className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm leading-tight">{ann.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1 mb-2">{ann.content}</p>
                            <span className="text-xs font-medium text-muted-foreground/70 block">
                              Posted: {format(new Date(ann.createdAt), 'MMM d, yyyy')}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    <p>No new announcements.</p>
                  </div>
                )}
              </div>
            </div>

            {/* School Calendar */}
            <div className="bg-card border shadow-sm rounded-xl overflow-hidden">
              <div className="border-b p-4 flex items-center justify-between">
                <h3 className="font-serif font-bold text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Upcoming Events
                </h3>
              </div>
              <div className="p-4 space-y-4">
                {eventsData && eventsData.length > 0 ? (
                  eventsData.slice(0, 4).map((event) => (
                    <div key={event.id} className="flex gap-4 items-start group">
                      <div className="bg-muted rounded-lg p-2 text-center min-w-14 shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <div className="text-[10px] font-bold uppercase">{format(new Date(event.startDate), 'MMM')}</div>
                        <div className="text-lg font-bold leading-none">{format(new Date(event.startDate), 'dd')}</div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm line-clamp-2 leading-tight mb-1 group-hover:text-primary transition-colors">{event.title}</h4>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs text-muted-foreground font-medium">
                            {format(new Date(event.startDate), 'h:mm a')}
                          </span>
                          {event.location && (
                            <span className="text-[11px] text-muted-foreground truncate max-w-[200px]">
                              @ {event.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-muted-foreground text-sm">
                    No upcoming events scheduled.
                  </div>
                )}
              </div>
            </div>

            {/* Downloads Quick Link */}
            <Link href="/downloads" className="block bg-secondary hover:bg-secondary/90 text-secondary-foreground p-6 rounded-xl transition-transform hover:scale-[102] shadow-sm">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">School Forms & Files</h3>
                  <p className="text-sm opacity-90">Download essential documents</p>
                </div>
              </div>
            </Link>

          </div>
        </div>
      </section>

    </div>
  );
}