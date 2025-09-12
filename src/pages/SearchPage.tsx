import { Search, MapPin, Clock, Filter } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { useToast } from "@/hooks/use-toast";
import RouteCard from "@/components/RouteCard";
import { useI18n } from "@/contexts/I18nContext";
import { UserButton } from "@clerk/clerk-react";

const SearchPage = () => {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<"all" | "express" | "local">("all");
  const { toast } = useToast();

  const performSearch = (query: string) => {
    if (query.trim()) {
      // Different mock results based on search query
      const routeDatabase = {
        Gachibowli: [
          {
            routeNumber: "290",
            routeName: "Gachibowli Express",
            destination: "Miyapur → Gachibowli",
            nextArrival: "5 min",
            frequency: "8 min",
            capacity: "Moderate" as const,
            color: "blue" as const,
            type: "express" as const,
          },
          {
            routeNumber: "219",
            routeName: "HITEC Shuttle",
            destination: "Kondapur → Hi-Tech City",
            nextArrival: "12 min",
            frequency: "15 min",
            capacity: "Light" as const,
            color: "green" as const,
            type: "local" as const,
          },
        ],
        Bachupally: [
          {
            routeNumber: "216",
            routeName: "Bachupally Express",
            destination: "Bachupally → Secunderabad",
            nextArrival: "3 min",
            frequency: "5 min",
            capacity: "Full" as const,
            color: "orange" as const,
            type: "express" as const,
          },
          {
            routeNumber: "272",
            routeName: "Patancheru Route",
            destination: "Bachupally → Patancheru",
            nextArrival: "8 min",
            frequency: "12 min",
            capacity: "Moderate" as const,
            color: "purple" as const,
            type: "local" as const,
          },
        ],
        University: [
          {
            routeNumber: "218",
            routeName: "VJIET Campus Line",
            destination: "VNR VJIET → Miyapur Metro",
            nextArrival: "6 min",
            frequency: "10 min",
            capacity: "Light" as const,
            color: "blue" as const,
            type: "express" as const,
          },
          {
            routeNumber: "250",
            routeName: "JNTU Express",
            destination: "JNTU → Kukatpally",
            nextArrival: "15 min",
            frequency: "20 min",
            capacity: "Moderate" as const,
            color: "green" as const,
            type: "local" as const,
          },
        ],
        Kondapur: [
          {
            routeNumber: "280",
            routeName: "ORR Express",
            destination: "Kondapur → Gachibowli",
            nextArrival: "4 min",
            frequency: "7 min",
            capacity: "Light" as const,
            color: "orange" as const,
            type: "express" as const,
          },
          {
            routeNumber: "281",
            routeName: "Cyber Gateway",
            destination: "Hi-Tech City → Madhapur",
            nextArrival: "18 min",
            frequency: "25 min",
            capacity: "Full" as const,
            color: "purple" as const,
            type: "local" as const,
          },
        ],
      };

      // Get routes based on search query
      const queryLower = query.toLowerCase();
      let allMockResults: any[] = [];
      
      if (queryLower.includes("gachibowli")) {
        allMockResults = routeDatabase.Gachibowli;
      } else if (queryLower.includes("bachupally")) {
        allMockResults = routeDatabase.Bachupally;
      } else if (queryLower.includes("university") || queryLower.includes("vjiet") || queryLower.includes("jntu")) {
        allMockResults = routeDatabase.University;
      } else if (queryLower.includes("kondapur") || queryLower.includes("hitech") || queryLower.includes("hi-tech")) {
        allMockResults = routeDatabase.Kondapur;
      } else {
        // Default search results for other queries
        allMockResults = [
          {
            routeNumber: "272",
            routeName: "Patancheru Express",
            destination: "Bachupally → Patancheru",
            nextArrival: "8 min",
            frequency: "10 min",
            capacity: "Moderate" as const,
            color: "blue" as const,
            type: "express" as const,
          },
          {
            routeNumber: "290U",
            routeName: "University Special",
            destination: "Miyapur → JNTU Campus",
            nextArrival: "12 min",
            frequency: "15 min",
            capacity: "Light" as const,
            color: "green" as const,
            type: "local" as const,
          },
        ];
      }

      // Filter results based on selected filter
      const filteredResults = selectedFilter === "all" 
        ? allMockResults 
        : allMockResults.filter(route => route.type === selectedFilter);

      setSearchResults(filteredResults);
      toast({
        title: "Search Results",
        description: `Found ${filteredResults.length} routes for "${query}"`,
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  const handlePopularSearch = (location: string) => {
    setSearchQuery(location);
    performSearch(location);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-surface-primary border-b border-border shadow-card">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3 mb-4">
            <Search className="w-6 h-6 text-transit-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">{t('search.title')}</h1>
              <p className="text-sm text-muted-foreground">{t('search.subtitle')}</p>
            </div>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
        
        {/* Search Bar */}
        <div className="px-4 pb-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search routes, stops, or destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-surface-secondary border-border/50 focus:border-transit-primary"
            />
          </form>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Filters */}
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <Toggle
            pressed={selectedFilter === "all"}
            onPressedChange={() => setSelectedFilter("all")}
            className="rounded-full px-3 py-1 text-sm data-[state=on]:bg-transit-primary data-[state=on]:text-primary-foreground"
          >
            All Routes
          </Toggle>
          <Toggle
            pressed={selectedFilter === "express"}
            onPressedChange={() => setSelectedFilter("express")}
            className="rounded-full px-3 py-1 text-sm data-[state=on]:bg-transit-primary data-[state=on]:text-primary-foreground"
          >
            Express
          </Toggle>
          <Toggle
            pressed={selectedFilter === "local"}
            onPressedChange={() => setSelectedFilter("local")}
            className="rounded-full px-3 py-1 text-sm data-[state=on]:bg-transit-primary data-[state=on]:text-primary-foreground"
          >
            Local
          </Toggle>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-transit-primary" />
              <h2 className="text-lg font-semibold text-foreground">
                Search Results ({searchResults.length})
              </h2>
            </div>

            <div className="space-y-4">
              {searchResults.map((route, index) => (
                <RouteCard
                  key={index}
                  {...route}
                  onTrack={() => toast({
                    title: "Tracking Route",
                    description: `Now tracking ${route.routeNumber} - ${route.routeName}`,
                  })}
                />
              ))}
            </div>
          </section>
        )}

        {/* Popular Searches */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Popular Searches</h2>
          <div className="grid grid-cols-2 gap-3">
            {["Gachibowli", "Bachupally", "University", "Kondapur"].map((location) => (
              <button
                key={location}
                onClick={() => handlePopularSearch(location)}
                className="p-3 bg-card rounded-lg border border-border/50 hover:bg-surface-secondary transition-colors"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-transit-primary" />
                  <span className="text-sm font-medium text-foreground">{location}</span>
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default SearchPage;