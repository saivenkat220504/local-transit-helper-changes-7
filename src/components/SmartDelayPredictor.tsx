import { useState, useEffect } from "react";
import { Cloud, CloudRain, Car, Clock } from "lucide-react";

interface WeatherData {
  condition: "sunny" | "rainy" | "cloudy";
  temperature: number;
}

interface TrafficData {
  congestion: "low" | "medium" | "high";
  incidents: number;
}

interface DelayPrediction {
  predictedDelay: number;
  factors: string[];
  confidence: number;
}

interface SmartDelayPredictorProps {
  route: string;
  baseArrivalTime: string;
  onPredictionUpdate: (delayMinutes: number, prediction: DelayPrediction) => void;
}

const SmartDelayPredictor = ({ route, baseArrivalTime, onPredictionUpdate }: SmartDelayPredictorProps) => {
  const [weather, setWeather] = useState<WeatherData>({ condition: "sunny", temperature: 22 });
  const [traffic, setTraffic] = useState<TrafficData>({ congestion: "low", incidents: 0 });
  const [prediction, setPrediction] = useState<DelayPrediction>({ predictedDelay: 0, factors: [], confidence: 0 });

  // Mock data simulation
  useEffect(() => {
    const generateMockData = () => {
      // Generate random weather
      const conditions: WeatherData["condition"][] = ["sunny", "rainy", "cloudy"];
      const newWeather: WeatherData = {
        condition: conditions[Math.floor(Math.random() * conditions.length)],
        temperature: Math.floor(Math.random() * 15) + 15, // 15-30°C
      };

      // Generate random traffic
      const congestionLevels: TrafficData["congestion"][] = ["low", "medium", "high"];
      const newTraffic: TrafficData = {
        congestion: congestionLevels[Math.floor(Math.random() * congestionLevels.length)],
        incidents: Math.floor(Math.random() * 3), // 0-2 incidents
      };

      setWeather(newWeather);
      setTraffic(newTraffic);
    };

    generateMockData();
    // Update data every 30 seconds for demo
    const interval = setInterval(generateMockData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Calculate delay prediction
  useEffect(() => {
    const calculateDelay = (): DelayPrediction => {
      let delayMinutes = 0;
      const factors: string[] = [];
      let confidence = 85; // Base confidence

      // Weather factors
      if (weather.condition === "rainy") {
        delayMinutes += 3;
        factors.push("Heavy rain affecting visibility");
        confidence -= 10;
      } else if (weather.condition === "cloudy") {
        delayMinutes += 1;
        factors.push("Overcast conditions");
      }

      // Traffic factors
      switch (traffic.congestion) {
        case "high":
          delayMinutes += 4;
          factors.push("High traffic congestion");
          confidence -= 15;
          break;
        case "medium":
          delayMinutes += 2;
          factors.push("Moderate traffic");
          confidence -= 5;
          break;
        default:
          factors.push("Light traffic");
          break;
      }

      // Incident factors
      if (traffic.incidents > 0) {
        delayMinutes += traffic.incidents * 2;
        factors.push(`${traffic.incidents} traffic incident${traffic.incidents > 1 ? 's' : ''} reported`);
        confidence -= traffic.incidents * 10;
      }

      // Historical route patterns (mock data)
      const routePatterns: Record<string, number> = {
        "12A": 1, // Downtown routes typically have 1min baseline delay
        "B15": 2, // University routes have 2min baseline
        "42X": 3, // Airport routes have 3min baseline
      };

      const historicalDelay = routePatterns[route] || 1;
      delayMinutes += historicalDelay;
      factors.push(`Historical ${route} route patterns`);

      // Random factor for rush hour simulation
      const hour = new Date().getHours();
      if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
        delayMinutes += 2;
        factors.push("Rush hour traffic");
        confidence -= 5;
      }

      // Ensure minimum confidence
      confidence = Math.max(confidence, 60);

      return {
        predictedDelay: Math.max(0, Math.round(delayMinutes)),
        factors,
        confidence: Math.round(confidence),
      };
    };

    const newPrediction = calculateDelay();
    setPrediction(newPrediction);
    onPredictionUpdate(newPrediction.predictedDelay, newPrediction);
  }, [weather, traffic, route, onPredictionUpdate]);

  const getWeatherIcon = () => {
    switch (weather.condition) {
      case "rainy":
        return <CloudRain className="w-4 h-4 text-blue-500" />;
      case "cloudy":
        return <Cloud className="w-4 h-4 text-gray-500" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-yellow-400" />;
    }
  };

  const getTrafficColor = () => {
    switch (traffic.congestion) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-yellow-500";
      default:
        return "text-green-500";
    }
  };

  return (
    <div className="bg-surface-secondary/30 rounded-lg p-3 mt-2 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-transit-primary" />
          <span className="text-sm font-medium text-foreground">Smart Delay Prediction</span>
        </div>
        <span className="text-xs text-muted-foreground">{prediction.confidence}% confidence</span>
      </div>

      {prediction.predictedDelay > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-orange-500 font-medium">
            +{prediction.predictedDelay} min delay predicted
          </span>
        </div>
      )}

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          {getWeatherIcon()}
          <span>{weather.condition} {weather.temperature}°C</span>
        </div>
        <div className="flex items-center gap-1">
          <Car className={`w-4 h-4 ${getTrafficColor()}`} />
          <span>{traffic.congestion} traffic</span>
        </div>
      </div>

      {prediction.factors.length > 0 && (
        <div className="text-xs text-muted-foreground">
          <div className="font-medium mb-1">Factors considered:</div>
          <ul className="space-y-0.5">
            {prediction.factors.slice(0, 2).map((factor, index) => (
              <li key={index}>• {factor}</li>
            ))}
            {prediction.factors.length > 2 && (
              <li>• +{prediction.factors.length - 2} more factors</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SmartDelayPredictor;