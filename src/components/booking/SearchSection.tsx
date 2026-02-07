import { motion } from 'framer-motion';
import { Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchSectionProps {
  venueQuery: string;
  onVenueQueryChange: (value: string) => void;
  onSearch: () => void;
  hasSearched: boolean;
  isSearching: boolean;
}

export default function SearchSection({
  venueQuery,
  onVenueQueryChange,
  onSearch,
  hasSearched,
  isSearching,
}: SearchSectionProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && venueQuery.trim()) {
      onSearch();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`w-full transition-all duration-500 ${
        hasSearched ? 'mb-8' : 'min-h-[60vh] flex items-center justify-center'
      }`}
    >
      <div className={`w-full max-w-2xl mx-auto ${hasSearched ? '' : 'text-center'}`}>
        {/* Heading - Only show prominently before search */}
        <motion.div
          animate={{
            scale: hasSearched ? 0.85 : 1,
            marginBottom: hasSearched ? '1rem' : '2rem',
          }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {!hasSearched && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-primary/10 border border-primary/20"
            >
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Find Your Perfect Parking Spot</span>
            </motion.div>
          )}
          
          <h1 className={`font-bold tracking-tight text-balance ${
            hasSearched 
              ? 'text-2xl md:text-3xl' 
              : 'text-4xl md:text-5xl lg:text-6xl mb-4'
          }`}>
            {hasSearched ? (
              <span className="text-foreground">Searching: <span className="gradient-text">{venueQuery}</span></span>
            ) : (
              <>
                Find Parking{' '}
                <span className="gradient-text">Near You</span>
              </>
            )}
          </h1>
          
          {!hasSearched && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg text-muted-foreground max-w-xl mx-auto mb-8"
            >
              Enter your destination and we&apos;ll find the perfect parking spot for you.
            </motion.p>
          )}
        </motion.div>

        {/* Search Card */}
        <motion.div
          layout
          className="glass-card p-6 md:p-8 glow-subtle"
        >
          <div className={`flex gap-4 ${hasSearched ? 'flex-row' : 'flex-col sm:flex-row'}`}>
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for a venue, mall, or location..."
                value={venueQuery}
                onChange={(e) => onVenueQueryChange(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isSearching}
                className="pl-12 h-14 text-lg bg-muted/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
              />
            </div>
            <Button
              onClick={onSearch}
              size="lg"
              className={`glow-primary h-14 ${hasSearched ? 'px-6' : 'px-8 text-lg'}`}
              disabled={!venueQuery.trim() || isSearching}
            >
              {isSearching ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="h-5 w-5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground"
                />
              ) : hasSearched ? (
                <Search className="w-5 h-5" />
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}