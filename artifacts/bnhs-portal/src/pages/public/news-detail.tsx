import { useGetNews, useListNews } from '@workspace/api-client-react';
import { useParams, Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronLeft, Share2, FileText, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: news, isLoading } = useGetNews(parseInt(id || '0'));
  
  // Get latest news for sidebar
  const { data: latestNews } = useListNews({ limit: 4 });

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: news?.title,
        text: news?.excerpt || `Read this article from Burgos National High School`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen container mx-auto px-4 py-16 max-w-5xl">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted w-24 rounded"></div>
          <div className="h-12 bg-muted w-3/4 rounded"></div>
          <div className="aspect-[21/9] bg-muted rounded-xl"></div>
          <div className="space-y-4">
            <div className="h-4 bg-muted w-full rounded"></div>
            <div className="h-4 bg-muted w-full rounded"></div>
            <div className="h-4 bg-muted w-5/6 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
        <p className="text-muted-foreground mb-8">The news article you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/news">Return to News</Link>
        </Button>
      </div>
    );
  }

  // Basic markdown parser for simple formatting
  const renderContent = (content: string) => {
    // Replace \n with <br>, handle basic bold **text**
    const htmlContent = content
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br/>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
    return <div dangerouslySetInnerHTML={{ __html: `<p>${htmlContent}</p>` }} />;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      
      {/* Top Breadcrumb Bar */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/news" className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
            <ChevronLeft className="h-4 w-4" /> Back to News
          </Link>
          <Button variant="ghost" size="sm" onClick={handleShare} className="text-muted-foreground hover:text-foreground">
            <Share2 className="h-4 w-4 mr-2" /> Share
          </Button>
        </div>
      </div>

      <article className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Article Content */}
          <div className="lg:col-span-2">
            
            <header className="mb-8 space-y-4">
              <span className="inline-block bg-secondary/20 text-secondary-foreground text-xs font-bold uppercase tracking-wider px-3 py-1 rounded">
                {news.category}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold leading-tight text-foreground">
                {news.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground border-b pb-6">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(news.publishedAt), 'MMMM d, yyyy')}
                </div>
                {news.authorName && (
                  <>
                    <span>•</span>
                    <div>By <span className="font-medium text-foreground">{news.authorName}</span></div>
                  </>
                )}
              </div>
            </header>

            {news.coverImage && (
              <figure className="mb-10 rounded-2xl overflow-hidden shadow-md">
                <img 
                  src={news.coverImage} 
                  alt={news.title} 
                  className="w-full h-auto max-h-[500px] object-cover" 
                />
              </figure>
            )}

            {news.excerpt && (
              <div className="text-xl text-muted-foreground font-medium leading-relaxed mb-8 italic border-l-4 border-secondary pl-6">
                {news.excerpt}
              </div>
            )}

            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-serif prose-headings:text-foreground prose-a:text-primary prose-img:rounded-xl">
              {renderContent(news.content)}
            </div>
            
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            <div className="bg-muted/30 rounded-2xl p-6 border sticky top-28">
              <h3 className="font-serif font-bold text-xl border-b pb-3 mb-4">Latest News</h3>
              <div className="space-y-6">
                {latestNews?.data?.filter(n => n.id !== news.id).slice(0, 4).map((item) => (
                  <Link key={item.id} href={`/news/${item.id}`} className="group block">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 shrink-0 rounded-md overflow-hidden bg-muted">
                        {item.coverImage ? (
                          <img src={item.coverImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary/20">
                            <FileText className="h-6 w-6" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col justify-center">
                        <h4 className="font-bold text-sm line-clamp-2 leading-snug group-hover:text-primary transition-colors mb-1">
                          {item.title}
                        </h4>
                        <span className="text-[11px] text-muted-foreground uppercase font-semibold">
                          {format(new Date(item.publishedAt), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t text-center">
                <Link href="/news" className="text-sm font-semibold text-primary inline-flex items-center hover:underline">
                  View all news <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
          </aside>

        </div>
      </article>
    </div>
  );
}