import { Clock, Users, AlertTriangle, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useCallback } from "react";
import SmartDelayPredictor from "@/components/SmartDelayPredictor";

interface RouteCardProps {
  routeNumber: string;
  routeName: string;
  destination: string;
  nextArrival: string;
  frequency: string;
  capacity: "Light" | "Moderate" | "Full" | "High";
  delay?: string;
  color: "blue" | "green" | "orange" | "purple";
  onTrack?: () => void;
}

const RouteCard = ({
  routeNumber,
  routeName,
  destination,
  nextArrival,
  frequency,
  capacity,
  delay,
  color,
  onTrack,
}: RouteCardProps) => {
  const [isTracking, setIsTracking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [adjustedArrival, setAdjustedArrival] = useState(nextArrival);
  const [delayPrediction, setDelayPrediction] = useState<{ predictedDelay: number; factors: string[]; confidence: number } | null>(null);

  const handleTrack = () => {
    if (!isTracking) {
      setIsTracking(true);
      
      // Set a fixed progress percentage (between 20-80%)
      const fixedProgress = Math.floor(Math.random() * 60) + 20;
      setProgress(fixedProgress);
    }
    onTrack?.();
  };

  const handleCancel = () => {
    setIsTracking(false);
    setProgress(0);
    // Remove this bus from tracked buses
    if ((window as any).removeTrackedBus) {
      (window as any).removeTrackedBus(routeNumber);
    }
  };

  const handlePredictionUpdate = useCallback((delayMinutes: number, prediction: any) => {
    setDelayPrediction(prediction);
    
    // Calculate adjusted arrival time
    const baseMinutes = parseInt(nextArrival);
    const adjustedMinutes = baseMinutes + delayMinutes;
    setAdjustedArrival(`${adjustedMinutes} min`);
  }, [nextArrival]);
  const colorClasses = {
    blue: "bg-route-blue border-route-blue/20",
    green: "bg-route-green border-route-green/20",
    orange: "bg-route-orange border-route-orange/20",
    purple: "bg-route-purple border-route-purple/20",
  };

  const capacityColors = {
    Light: "text-status-online",
    Moderate: "text-transit-warning",
    Full: "text-transit-danger",
    High: "text-transit-danger",
  };

  return (
    <div className="bg-card rounded-xl p-4 shadow-card border border-border/50 hover:shadow-elevated transition-all duration-200 animate-fade-in">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-sm border",
            colorClasses[color]
          )}>
            {routeNumber}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{routeName}</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Navigation size={12} />
              {destination}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className={cn(
            "text-2xl font-bold",
            delayPrediction && delayPrediction.predictedDelay > 0 ? "text-transit-warning" : 
            delay ? "text-transit-warning" : "text-status-online"
          )}>
            {delayPrediction && delayPrediction.predictedDelay > 0 ? adjustedArrival : nextArrival}
          </div>
          <p className="text-xs text-muted-foreground">
            {delayPrediction && delayPrediction.predictedDelay > 0 ? "Adjusted arrival" : "Next bus"}
          </p>
          {delayPrediction && delayPrediction.predictedDelay > 0 && (
            <p className="text-xs text-orange-500">
              (+{delayPrediction.predictedDelay} min delay)
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock size={14} />
            Every {frequency}
          </div>
          <div className="flex items-center gap-1">
            <Users size={14} />
            <span className={capacityColors[capacity]}>{capacity}</span>
          </div>
          {delay && (
            <div className="flex items-center gap-1 text-transit-warning">
              <AlertTriangle size={14} />
              {delay} delay
            </div>
          )}
        </div>
      </div>

      {isTracking && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Bus Progress</span>
            <span className="text-sm font-bold text-transit-primary">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-surface-secondary rounded-full h-2">
            <div 
              className="bg-transit-primary h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Smart Delay Prediction */}
      <SmartDelayPredictor
        route={routeNumber}
        baseArrivalTime={nextArrival}
        onPredictionUpdate={handlePredictionUpdate}
      />

      <div className="flex gap-2">
        {onTrack && !isTracking && (
          <button
            onClick={handleTrack}
            className="flex-1 py-2 px-4 rounded-lg font-medium transition-colors duration-200 bg-surface-secondary text-foreground hover:bg-surface-elevated"
          >
            Track
          </button>
        )}
        {isTracking && (
          <button
            onClick={handleCancel}
            className="flex-1 py-2 px-4 rounded-lg font-medium transition-colors duration-200 bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default RouteCard;