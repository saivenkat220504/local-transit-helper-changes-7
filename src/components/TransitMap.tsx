import { MapPin, Navigation, Zap, Bus, Route } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

interface BusStop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  routes: string[];
}

interface TransitMapProps {
  isLowBandwidth?: boolean;
  trackedBuses?: Array<{ routeNumber: string; lat: number; lng: number; }>;
}

const MAPBOX_API_KEY = 'pk.eyJ1IjoibmlzaGFudGhuaXRpc2giLCJhIjoiY21mZ2Z2a25xMDBkNjJqc2wycGV5ZDB0NCJ9.wOFw5YG9sozJmkxTPZulXQ';

const TransitMap = ({ isLowBandwidth = false, trackedBuses = [] }: TransitMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const routingControlRef = useRef<any>(null);
  const busMarkersRef = useRef<L.Marker[]>([]);
  
  const [fromStop, setFromStop] = useState<string>('');
  const [toStop, setToStop] = useState<string>('');
  const [isRouteVisible, setIsRouteVisible] = useState(false);

  // Bus stops with real coordinates (Hyderabad area)
  const busStops: BusStop[] = [
    { id: "1", name: "Bachupally", lat: 17.5449, lng: 78.3428, routes: ["216", "218"] },
    { id: "2", name: "Nizampet", lat: 17.5081, lng: 78.3889, routes: ["216"] },
    { id: "3", name: "KPHB Colony", lat: 17.4929, lng: 78.3912, routes: ["218"] },
    { id: "4", name: "Miyapur Metro", lat: 17.4970, lng: 78.3587, routes: ["218", "280"] },
    { id: "5", name: "Hi-Tech City", lat: 17.4435, lng: 78.3772, routes: ["280"] },
    { id: "6", name: "Kondapur", lat: 17.4620, lng: 78.3676, routes: ["280"] },
  ];

  // Custom bus stop icon
  const createBusStopIcon = (isSelected = false) => {
    return L.divIcon({
      className: 'custom-bus-stop-icon',
      html: `<div style="
        width: 24px; 
        height: 24px; 
        background: ${isSelected ? '#ff6b35' : '#4f46e5'}; 
        border: 2px solid white; 
        border-radius: 50%; 
        display: flex; 
        align-items: center; 
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        color: white;
        font-size: 12px;
        font-weight: bold;
      ">🚏</div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  };

  // Custom bus icon
  const createBusIcon = (routeNumber: string) => {
    return L.divIcon({
      className: 'custom-bus-icon',
      html: `<div style="
        background: #10b981; 
        color: white; 
        padding: 2px 6px; 
        border-radius: 12px; 
        font-size: 10px; 
        font-weight: bold;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        text-align: center;
        min-width: 30px;
      ">${routeNumber}</div>`,
      iconSize: [40, 20],
      iconAnchor: [20, 10]
    });
  };

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Expose Leaflet globally for plugins
    (window as any).L = L;

    // Initialize map
    const map = L.map(mapRef.current, {
      center: [17.4851, 78.3657], // Hyderabad coordinates
      zoom: 12,
      zoomControl: true
    });

    mapInstanceRef.current = map;

    // Add Mapbox tile layer
    L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${MAPBOX_API_KEY}`, {
      attribution: '© Mapbox © OpenStreetMap',
      tileSize: 512,
      zoomOffset: -1,
      maxZoom: 18
    }).addTo(map);

    // Add bus stop markers
    busStops.forEach((stop) => {
      const marker = L.marker([stop.lat, stop.lng], {
        icon: createBusStopIcon(false)
      }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: system-ui; padding: 4px;">
          <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: bold;">${stop.name}</h3>
          <p style="margin: 0; font-size: 12px; color: #666;">Routes: ${stop.routes.join(', ')}</p>
        </div>
      `);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update tracked buses on map
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing bus markers
    busMarkersRef.current.forEach(marker => {
      mapInstanceRef.current?.removeLayer(marker);
    });
    busMarkersRef.current = [];

    // Add new bus markers
    trackedBuses.forEach((bus) => {
      const marker = L.marker([bus.lat, bus.lng], {
        icon: createBusIcon(bus.routeNumber)
      });
      
      if (mapInstanceRef.current) {
        marker.addTo(mapInstanceRef.current);
        busMarkersRef.current.push(marker);
      }
    });
  }, [trackedBuses]);

  const handleRouteSearch = async () => {
    if (!mapInstanceRef.current || !fromStop || !toStop) return;

    const fromStopData = busStops.find(s => s.id === fromStop);
    const toStopData = busStops.find(s => s.id === toStop);

    if (!fromStopData || !toStopData) return;

    // Ensure Routing Machine is loaded after L is global
    if (!(window as any).L?.Routing) {
      (window as any).L = L;
      await import('leaflet-routing-machine');
    }

    // Remove existing routing control
    if (routingControlRef.current) {
      mapInstanceRef.current.removeControl(routingControlRef.current);
    }

    // Add new routing control
    routingControlRef.current = (window as any).L.Routing.control({
      waypoints: [
        L.latLng(fromStopData.lat, fromStopData.lng),
        L.latLng(toStopData.lat, toStopData.lng)
      ],
      routeWhileDragging: false,
      addWaypoints: false,
      createMarker: () => null, // Don't create default markers
      lineOptions: {
        styles: [{ color: '#4f46e5', weight: 4, opacity: 0.8 }]
      }
    }).addTo(mapInstanceRef.current!);

    setIsRouteVisible(true);
  };

  const clearRoute = () => {
    if (routingControlRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeControl(routingControlRef.current);
      routingControlRef.current = null;
      setIsRouteVisible(false);
    }
  };

  if (isLowBandwidth) {
    return (
      <div className="bg-card rounded-xl p-4 shadow-card border border-border/50">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-transit-warning" />
          <span className="text-sm font-medium text-transit-warning">Low Data Mode Active</span>
        </div>
        <div className="space-y-3">
          {busStops.map((stop) => (
            <div key={stop.id} className="bg-surface-secondary p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">{stop.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Routes: {stop.routes.join(", ")}
                  </p>
                </div>
                <button className="text-transit-primary hover:text-transit-primary/80">
                  <Navigation size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-card border border-border/50">
      {/* Route Selection Controls */}
      <div className="p-4 bg-surface-primary border-b border-border/50">
        <div className="flex items-center gap-2 mb-3">
          <Route className="w-5 h-5 text-transit-primary" />
          <h3 className="text-sm font-semibold text-foreground">Plan Your Route</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <select
            value={fromStop}
            onChange={(e) => setFromStop(e.target.value)}
            className="bg-surface-secondary border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:border-transit-primary focus:outline-none"
          >
            <option value="">From Stop</option>
            {busStops.map((stop) => (
              <option key={stop.id} value={stop.id}>{stop.name}</option>
            ))}
          </select>
          <select
            value={toStop}
            onChange={(e) => setToStop(e.target.value)}
            className="bg-surface-secondary border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:border-transit-primary focus:outline-none"
          >
            <option value="">To Stop</option>
            {busStops.map((stop) => (
              <option key={stop.id} value={stop.id}>{stop.name}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <button
              onClick={handleRouteSearch}
              disabled={!fromStop || !toStop}
              className="flex-1 bg-transit-primary text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-transit-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Show Route
            </button>
            {isRouteVisible && (
              <button
                onClick={clearRoute}
                className="px-3 py-2 bg-surface-secondary text-foreground border border-border/50 rounded-lg text-sm hover:bg-surface-secondary/80 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div 
        ref={mapRef}
        className="h-80 w-full bg-gray-100"
        style={{ minHeight: '320px' }}
      />
      
      {/* Map Info */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-transit-primary" />
            <span className="text-sm font-medium text-foreground">{busStops.length} bus stops</span>
            {trackedBuses.length > 0 && (
              <>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">{trackedBuses.length} active buses</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-transit-primary rounded-full"></div>
              <span>Bus Stops</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Active Buses</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransitMap;