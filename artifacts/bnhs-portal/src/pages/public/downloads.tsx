import { useListDownloads } from '@workspace/api-client-react';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, FileText, Download as DownloadIcon, Filter } from 'lucide-react';
import { format } from 'date-fns';

export default function Downloads() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: downloads, isLoading } = useListDownloads(
    activeCategory !== 'all' ? { category: activeCategory } : {}
  );

  const categories = ['School Forms', 'Enrollment Forms', 'School Calendar', 'Memoranda', 'PTA Documents', 'SSLG Documents', 'Others'];

  const filteredDownloads = downloads?.filter(d => 
    searchQuery === '' || 
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (d.description && d.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col min-h-screen pb-20 bg-muted/20">
      {/* Page Header */}
      <div className="bg-primary text-primary-foreground py-16 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Downloadable Resources</h1>
          <p className="text-lg max-w-2xl mx-auto opacity-90">Access official forms, documents, and other important files from the school administration.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Categories Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card border rounded-xl p-5 shadow-sm">
              <h3 className="font-serif font-bold text-lg flex items-center gap-2 mb-4 border-b pb-3">
                <Filter className="h-5 w-5 text-secondary" />
                Categories
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    activeCategory === 'all' ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  All Documents
                </button>
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                      activeCategory === category ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            
            {/* Search */}
            <div className="relative mb-8 shadow-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search documents by title or description..." 
                className="pl-12 h-14 text-base bg-card border-border rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Results */}
            <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 md:p-6 bg-muted/30 border-b flex justify-between items-center">
                <h2 className="font-serif font-bold text-xl">
                  {activeCategory === 'all' ? 'All Documents' : activeCategory}
                </h2>
                <span className="text-sm text-muted-foreground font-medium bg-background px-3 py-1 rounded-full border">
                  {filteredDownloads?.length || 0} files
                </span>
              </div>

              {isLoading ? (
                <div className="p-8 space-y-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex gap-4 p-4 border rounded-xl animate-pulse">
                      <div className="w-12 h-12 bg-muted rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-5 bg-muted w-1/3 rounded"></div>
                        <div className="h-4 bg-muted w-1/4 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredDownloads && filteredDownloads.length > 0 ? (
                <ul className="divide-y divide-border">
                  {filteredDownloads.map(doc => (
                    <li key={doc.id} className="p-4 md:p-6 hover:bg-muted/30 transition-colors group">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="bg-primary/10 text-primary p-3 rounded-xl shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <FileText className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-base leading-tight mb-1 group-hover:text-primary transition-colors">{doc.title}</h3>
                            {doc.description && <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{doc.description}</p>}
                            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground font-medium">
                              <span className="bg-background px-2 py-0.5 rounded border shadow-sm">{doc.category}</span>
                              <span>Added {format(new Date(doc.createdAt), 'MMM d, yyyy')}</span>
                              <span className="font-mono text-xs opacity-70">{doc.fileName}</span>
                            </div>
                          </div>
                        </div>
                        <a 
                          href={doc.fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="shrink-0 flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground px-4 py-2.5 rounded-lg font-bold transition-all shadow-sm group-hover:shadow md:w-auto w-full mt-2 md:mt-0"
                        >
                          <DownloadIcon className="h-4 w-4" /> Download
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-20">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                  <h3 className="text-xl font-semibold mb-2">No documents found</h3>
                  <p className="text-muted-foreground">Try selecting a different category or adjusting your search.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}