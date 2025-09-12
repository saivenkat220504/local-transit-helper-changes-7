import { Search, MapPin, Clock, Bus } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import RouteCard from "@/components/RouteCard";
import QuickActions from "@/components/QuickActions";
import TransitMap from "@/components/TransitMap";

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoute, setSelectedRoute] = useState<{ from: string; to: string } | null>(null);
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search page with query
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    } else {
      toast({
        title: "Search Required",
        description: "Please enter a search term",
      });
    }
  };

  const handlePayFare = () => {
    toast({
      title: "Payment Portal",
      description: "Opening mobile payment options...",
    });
  };

  const handleCatchBus = () => {
    toast({
      title: "Catch This Bus?",
      description: "Calculating walking time vs bus arrival...",
    });
  };

  const handleReportIssue = () => {
    toast({
      title: "Report Issue",
      description: "Community reporting feature activated",
    });
  };

  const allRoutes = [
    {
      routeNumber: "216",
      routeName: "Bachupally Express",
      destination: "Bachupally → Secunderabad",
      nextArrival: "5 min",
      frequency: "8 min",
      capacity: "Light" as const,
      color: "blue" as const,
      stops: ["Bachupally", "Nizampet"],
    },
    {
      routeNumber: "218", 
      routeName: "VJIET Campus Line",
      destination: "VNR VJIET → Miyapur Metro",
      nextArrival: "5 min",
      frequency: "15 min",
      capacity: "Light" as const,
      color: "green" as const,
      stops: ["Bachupally", "KPHB Colony", "Miyapur Metro"],
    },
    {
      routeNumber: "280",
      routeName: "Hi-Tech Express", 
      destination: "Kondapur → Hi-Tech City",
      nextArrival: "12 min",
      frequency: "20 min",
      capacity: "High" as const,
      color: "orange" as const,
      stops: ["Miyapur Metro", "Hi-Tech City", "Kondapur"],
    },
  ];

  const busStops = [
    { id: "1", name: "Bachupally" },
    { id: "2", name: "Nizampet" },
    { id: "3", name: "KPHB Colony" },
    { id: "4", name: "Miyapur Metro" },
    { id: "5", name: "Hi-Tech City" },
    { id: "6", name: "Kondapur" },
  ];

  // Filter routes based on selected route
  const getAvailableRoutes = () => {
    if (!selectedRoute) return allRoutes;
    
    return allRoutes.filter(route => {
      const fromIndex = route.stops.indexOf(selectedRoute.from);
      const toIndex = route.stops.indexOf(selectedRoute.to);
      // Route must contain both stops and they should be in correct order (from before to)
      return fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex;
    });
  };

  const handleRouteSelection = (from: string, to: string) => {
    setSelectedRoute({ from, to });
  };

  const availableRoutes = getAvailableRoutes();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-surface-primary border-b border-border shadow-card">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-6 h-6 text-transit-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Transit Tracker</h1>
              <p className="text-sm text-muted-foreground">Find routes and stops</p>
            </div>
          </div>
          
          {/* Search Bar */}
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
        {/* Map */}
        <TransitMap onRouteSelect={handleRouteSelection} />

        {/* Quick Actions */}
        <QuickActions
          onPayFare={handlePayFare}
          onCatchBus={handleCatchBus}
          onReportIssue={handleReportIssue}
        />

        {/* Routes Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bus className="w-5 h-5 text-transit-primary" />
              <h2 className="text-lg font-semibold text-foreground">
                {selectedRoute 
                  ? `Available Buses: ${selectedRoute.from} → ${selectedRoute.to}`
                  : `All Routes`
                }
              </h2>
              <span className="bg-transit-primary/10 text-transit-primary px-2 py-1 rounded-full text-sm font-medium">
                {availableRoutes.length} {availableRoutes.length === 1 ? 'route' : 'routes'}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button className="bg-card text-foreground px-4 py-2 rounded-lg border border-border/50 hover:bg-surface-secondary transition-colors">
                Routes ({availableRoutes.length})
              </button>
              <button className="text-muted-foreground px-4 py-2 rounded-lg hover:bg-surface-secondary transition-colors">
                Stops ({busStops.length})
              </button>
            </div>
          </div>

          {selectedRoute && availableRoutes.length === 0 && (
            <div className="bg-surface-secondary rounded-lg p-6 text-center">
              <Bus className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-lg font-medium text-foreground mb-2">No direct buses available</p>
              <p className="text-sm text-muted-foreground">
                No buses serve the direct route from <span className="font-medium">{selectedRoute.from}</span> to <span className="font-medium">{selectedRoute.to}</span>
              </p>
              <button 
                onClick={() => setSelectedRoute(null)}
                className="mt-4 px-4 py-2 bg-transit-primary text-white rounded-lg text-sm hover:bg-transit-primary/90 transition-colors"
              >
                View All Routes
              </button>
            </div>
          )}

          <div className="space-y-4">
            {availableRoutes.map((route, index) => (
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
      </main>
    </div>
  );
};

export default HomePage;