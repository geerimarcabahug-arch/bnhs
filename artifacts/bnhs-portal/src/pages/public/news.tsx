import { useListNews } from '@workspace/api-client-react';
import { useState, useRef } from 'react';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Calendar, ChevronRight, FileText, Pin } from 'lucide-react';
import { format } from 'date-fns';

export default function News() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(val);
      setPage(1);
    }, 500);
  };

  const { data: pinnedNews, isLoading: loadingPinned } = useListNews({ pinned: true, limit: 3 });
  const { data: regularNews, isLoading: loadingRegular } = useListNews({ 
    pinned: false, 
    search: debouncedSearch || undefined,
    page,
    limit: 12
  });

  return (
    <div className="flex flex-col min-h-screen pb-20 bg-muted/20">
      {/* Page Header */}
      <div className="bg-primary text-primary-foreground py-16 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">News & Updates</h1>
          <p className="text-lg max-w-2xl mx-auto opacity-90">Stay informed about the latest events, achievements, and announcements from BNHS.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl space-y-16">
        
        {/* Search Bar */}
        <div className="max-w-xl mx-auto relative -mt-20 z-20">
          <div className="bg-card p-2 rounded-xl shadow-lg border flex items-center">
            <Search className="h-5 w-5 text-muted-foreground ml-3 shrink-0" />
            <Input 
              placeholder="Search news articles..." 
              className="border-0 focus-visible:ring-0 shadow-none h-12 text-base"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* Pinned News (Only show if not searching) */}
        {!debouncedSearch && pinnedNews?.data && pinnedNews.data.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Pin className="h-5 w-5 text-secondary" />
              <h2 className="text-2xl font-serif font-bold">Featured Stories</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {pinnedNews.data.map((news, index) => (
                <Link key={news.id} href={`/news/${news.id}`} className={`group flex flex-col bg-card rounded-2xl border overflow-hidden shadow-sm hover:shadow-xl transition-all ${index === 0 ? 'lg:col-span-2 lg:flex-row' : ''}`}>
                  <div className={`bg-muted relative overflow-hidden ${index === 0 ? 'lg:w-1/2 aspect-video lg:aspect-auto' : 'aspect-video'}`}>
                    {news.coverImage ? (
                      <img src={news.coverImage} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary/20">
                        <FileText className="h-16 w-16" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1.5 rounded-md shadow-sm">
                      {news.category}
                    </div>
                  </div>
                  <div className={`p-6 md:p-8 flex-1 flex flex-col justify-center ${index === 0 ? 'lg:w-1/2' : ''}`}>
                    <div className="text-sm text-muted-foreground mb-3 flex items-center gap-2 font-medium">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(news.publishedAt), 'MMMM d, yyyy')}
                    </div>
                    <h3 className={`font-serif font-bold mb-4 group-hover:text-primary transition-colors ${index === 0 ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
                      {news.title}
                    </h3>
                    <p className="text-muted-foreground line-clamp-3 mb-6 flex-1 text-base leading-relaxed">
                      {news.excerpt || news.content.substring(0, 150) + '...'}
                    </p>
                    <span className="text-primary font-bold inline-flex items-center gap-2 group-hover:gap-3 transition-all mt-auto w-fit border-b-2 border-transparent group-hover:border-primary pb-1">
                      Read full article <ChevronRight className="h-5 w-5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Regular News List */}
        <section>
          <div className="flex items-center justify-between mb-8 border-b pb-4">
            <h2 className="text-2xl font-serif font-bold">{debouncedSearch ? 'Search Results' : 'Latest News'}</h2>
            {regularNews && <span className="text-muted-foreground text-sm font-medium">{regularNews.total} articles</span>}
          </div>

          {loadingRegular ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Card key={i} className="animate-pulse overflow-hidden">
                  <div className="aspect-video bg-muted"></div>
                  <CardContent className="p-5">
                    <div className="h-3 bg-muted w-1/3 rounded mb-4"></div>
                    <div className="h-5 bg-muted w-full rounded mb-2"></div>
                    <div className="h-5 bg-muted w-2/3 rounded mb-4"></div>
                    <div className="h-4 bg-muted w-full rounded mb-2"></div>
                    <div className="h-4 bg-muted w-4/5 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : regularNews?.data && regularNews.data.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularNews.data.map((news) => (
                  <Link key={news.id} href={`/news/${news.id}`} className="group flex flex-col bg-card rounded-xl border overflow-hidden shadow-sm hover:shadow-md transition-all">
                    <div className="aspect-video bg-muted relative overflow-hidden">
                      {news.coverImage ? (
                        <img src={news.coverImage} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary/20">
                          <FileText className="h-12 w-12" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm text-primary-foreground text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded">
                        {news.category}
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="text-xs text-muted-foreground mb-3 flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5" />
                        {format(new Date(news.publishedAt), 'MMMM d, yyyy')}
                      </div>
                      <h3 className="font-bold text-lg mb-2 line-clamp-2 leading-snug group-hover:text-primary transition-colors">{news.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                        {news.excerpt || news.content.substring(0, 150) + '...'}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {regularNews.total > regularNews.limit && (
                <div className="mt-12 flex justify-center gap-2">
                  <Button variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                    Previous
                  </Button>
                  <Button variant="outline" disabled={page * regularNews.limit >= regularNews.total} onClick={() => setPage(p => p + 1)}>
                    Next Page
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-card rounded-xl border border-dashed">
              <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
              <h3 className="text-xl font-semibold mb-2">No articles found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria or check back later.</p>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}