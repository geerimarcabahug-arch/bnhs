import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/auth-context';
import { ThemeToggle } from './theme-toggle';
import bnhsLogo from '../assets/bnhs-logo.png';
import { Menu, Search, X } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function PublicHeader() {
  const [location, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/personnel', label: 'Personnel' },
    { href: '/sslg', label: 'SSLG' },
    { href: '/pta', label: 'PTA' },
    { href: '/news', label: 'News' },
    { href: '/downloads', label: 'Downloads' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/contact', label: 'Contact' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/news?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="bg-white rounded-full p-1 h-12 w-12 flex items-center justify-center overflow-hidden shrink-0 shadow-sm transition-transform group-hover:scale-105">
                <img src={bnhsLogo} alt="BNHS Logo" className="h-10 w-10 object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-lg leading-tight tracking-tight hidden sm:block md:text-xl">
                  Burgos National High School
                </span>
                <span className="font-serif font-bold text-xl block sm:hidden">
                  BNHS
                </span>
                <span className="text-xs text-primary-foreground/80 font-medium tracking-wide hidden sm:block">
                  A Tradition of Excellence
                </span>
              </div>
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <nav className="flex items-center gap-1 text-sm font-medium">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md transition-colors ${
                    location === link.href
                      ? 'bg-secondary text-secondary-foreground font-semibold'
                      : 'hover:bg-primary-foreground/10'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-3 border-l border-primary-foreground/20 pl-6">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-foreground/60" />
                <Input
                  type="search"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 pl-9 focus-visible:ring-secondary focus-visible:border-secondary h-9"
                />
              </form>
              <ThemeToggle />
            </div>
          </div>

          <div className="flex lg:hidden items-center gap-4">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -mr-2 text-primary-foreground hover:bg-primary-foreground/10 rounded-md"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-primary-foreground/10 bg-primary absolute w-full shadow-lg">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-foreground/60" />
              <Input
                type="search"
                placeholder="Search portal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 pl-10 focus-visible:ring-secondary focus-visible:border-secondary"
              />
            </form>
            <nav className="flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-md transition-colors ${
                    location === link.href
                      ? 'bg-secondary text-secondary-foreground font-semibold'
                      : 'hover:bg-primary-foreground/10 text-primary-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}