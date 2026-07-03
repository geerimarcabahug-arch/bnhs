import { useListPersonnel } from '@workspace/api-client-react';
import { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, UserCircle, Briefcase, Mail } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Personnel() {
  const [activeTab, setActiveTab] = useState<'teaching' | 'non_teaching' | 'admin'>('teaching');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => setDebouncedSearch(val), 500);
  };

  const { data: personnel, isLoading } = useListPersonnel({
    type: activeTab,
    search: debouncedSearch || undefined
  });

  return (
    <div className="flex flex-col min-h-screen pb-20 bg-muted/20">
      {/* Page Header */}
      <div className="bg-primary text-primary-foreground py-16 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Personnel Directory</h1>
          <p className="text-lg max-w-2xl mx-auto opacity-90">Meet the dedicated educators and staff behind Burgos National High School.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        
        {/* Controls */}
        <div className="bg-card border rounded-xl p-4 md:p-6 mb-8 flex flex-col md:flex-row gap-6 justify-between items-center shadow-sm">
          <div className="flex bg-muted/50 p-1 rounded-lg w-full md:w-auto">
            <button
              onClick={() => setActiveTab('teaching')}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-md text-sm font-semibold transition-all ${
                activeTab === 'teaching' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              Teaching Staff
            </button>
            <button
              onClick={() => setActiveTab('non_teaching')}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-md text-sm font-semibold transition-all ${
                activeTab === 'non_teaching' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              Non-Teaching
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-md text-sm font-semibold transition-all ${
                activeTab === 'admin' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              Administration
            </button>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search by name or position..." 
              className="pl-10 h-11 bg-background"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* Directory Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6 flex flex-col items-center">
                  <div className="w-24 h-24 bg-muted rounded-full mb-4"></div>
                  <div className="h-4 bg-muted w-3/4 rounded mb-2"></div>
                  <div className="h-3 bg-muted w-1/2 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : personnel && personnel.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {personnel.map(person => (
              <Card key={person.id} className="text-center hover-elevate transition-all border-b-4 border-b-transparent hover:border-b-primary group">
                <CardContent className="p-6">
                  <Avatar className="w-24 h-24 mx-auto mb-5 border-4 border-muted shadow-sm group-hover:border-primary/20 transition-colors">
                    <AvatarImage src={person.photoUrl || ''} />
                    <AvatarFallback className="bg-primary/5 text-primary">
                      <UserCircle className="w-12 h-12" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <h3 className="font-bold text-lg leading-tight mb-1">{person.name}</h3>
                  <p className="text-primary font-medium text-sm mb-4">{person.position}</p>
                  
                  <div className="space-y-2 text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg text-left">
                    {person.department && (
                      <div className="flex items-start gap-2">
                        <Briefcase className="w-4 h-4 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{person.department}</span>
                      </div>
                    )}
                    {person.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 shrink-0" />
                        <a href={`mailto:${person.email}`} className="hover:text-primary truncate">{person.email}</a>
                      </div>
                    )}
                    {person.advisoryClass && activeTab === 'teaching' && (
                      <div className="mt-2 pt-2 border-t text-xs font-semibold">
                        Adviser: {person.advisoryClass}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-card rounded-xl border border-dashed">
            <UserCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
            <h3 className="text-xl font-semibold mb-2">No personnel found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}