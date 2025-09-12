import { Search, MapPin, Clock } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import RouteCard from "@/components/RouteCard";
import QuickActions from "@/components/QuickActions";
import TransitMap from "@/components/TransitMap";
import { useI18n } from "@/contexts/I18nContext";
import { UserButton } from "@clerk/clerk-react";

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [trackedBuses, setTrackedBuses] = useState<Array<{ routeNumber: string; lat: number; lng: number; }>>([]);
  const { toast } = useToast();
  const { t } = useI18n();

  // Global function to remove tracked bus
  (window as any).removeTrackedBus = (routeNumber: string) => {
    setTrackedBuses(prev => prev.filter(bus => bus.routeNumber !== routeNumber));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search page with query
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    } else {
      toast({
        title: t('home.searchRequired'),
        description: t('home.searchDescription'),
      });
    }
  };

  const handlePayFare = () => {
    toast({
      title: t('home.paymentPortal'),
      description: t('home.paymentDescription'),
    });
  };

  const handleCatchBus = () => {
    toast({
      title: t('home.catchBus'),
      description: t('home.catchDescription'),
    });
  };

  const handleReportIssue = () => {
    toast({
      title: t('home.reportIssue'),
      description: t('home.reportDescription'),
    });
  };

  const mockRoutes = [
    {
      routeNumber: "216",
      routeName: "Bachupally Express",
      destination: "Bachupally → Secunderabad",
      nextArrival: "5 min",
      frequency: "8 min",
      capacity: "Light" as const,
      color: "blue" as const,
    },
    {
      routeNumber: "218",
      routeName: "VJIET Campus Line",
      destination: "VNR VJIET → Miyapur Metro",
      nextArrival: "5 min",
      frequency: "15 min",
      capacity: "Light" as const,
      color: "green" as const,
    },
    {
      routeNumber: "280",
      routeName: "Hi-Tech Express",
      destination: "Kondapur → Hi-Tech City",
      nextArrival: "5 min",
      frequency: "20 min",
      capacity: "High" as const,
      color: "orange" as const,
      
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-surface-primary border-b border-border shadow-card">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-6 h-6 text-transit-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">{t('home.title')}</h1>
              <p className="text-sm text-muted-foreground">{t('home.subtitle')}</p>
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
              placeholder={t('home.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-surface-secondary border-border/50 focus:border-transit-primary"
            />
          </form>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Map */}
        <TransitMap trackedBuses={trackedBuses} />

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
              <Clock className="w-5 h-5 text-transit-primary" />
              <h2 className="text-lg font-semibold text-foreground">Routes (3)</h2>
            </div>
            <div className="flex items-center gap-4">
              <button className="bg-card text-foreground px-4 py-2 rounded-lg border border-border/50 hover:bg-surface-secondary transition-colors">
                Routes (3)
              </button>
              <button className="text-muted-foreground px-4 py-2 rounded-lg hover:bg-surface-secondary transition-colors">
                Stops (6)
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {mockRoutes.map((route, index) => (
              <RouteCard
                key={index}
                {...route}
                onTrack={() => {
                  // Add bus to tracked buses with random position in Hyderabad area
                  const newBus = {
                    routeNumber: route.routeNumber,
                    lat: 17.4851 + (Math.random() - 0.5) * 0.2, // Random lat around Hyderabad
                    lng: 78.3657 + (Math.random() - 0.5) * 0.2, // Random lng around Hyderabad
                  };
                  setTrackedBuses(prev => [...prev.filter(bus => bus.routeNumber !== route.routeNumber), newBus]);
                  toast({
                    title: t('home.trackingRoute'),
                    description: `${t('home.nowTracking')} ${route.routeNumber} - ${route.routeName}`,
                  });
                }}
              />
            ))}
          </div>
        </section>

      </main>
    </div>
  );
};

export default HomePage;
