import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { UserButton } from "@clerk/clerk-react";
import { 
  MapPin, 
  Clock, 
  AlertTriangle, 
  Users, 
  Radio, 
  Megaphone,
  Navigation,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RouteStop {
  id: string;
  name: string;
  estimatedTime: string;
  status: 'completed' | 'current' | 'upcoming';
}

const DriverPage = () => {
  const { toast } = useToast();
  const [isLiveLocationOn, setIsLiveLocationOn] = useState(false);
  const [currentRoute, setCurrentRoute] = useState("Route 45A");
  const [busStatus, setBusStatus] = useState("Running on Time");
  const [seatCapacity, setSeatCapacity] = useState(40);
  const [occupiedSeats, setOccupiedSeats] = useState(15);
  const [announcement, setAnnouncement] = useState("");
  const [routeProgress, setRouteProgress] = useState(35);

  const routeStops: RouteStop[] = [
    { id: "1", name: "Central Station", estimatedTime: "09:00 AM", status: "completed" },
    { id: "2", name: "City Mall", estimatedTime: "09:15 AM", status: "completed" },
    { id: "3", name: "University Gate", estimatedTime: "09:30 AM", status: "current" },
    { id: "4", name: "Hospital Junction", estimatedTime: "09:45 AM", status: "upcoming" },
    { id: "5", name: "Bus Terminal", estimatedTime: "10:00 AM", status: "upcoming" },
  ];

  const statusOptions = [
    "Running on Time",
    "Traffic Jam",
    "Breakdown",
    "Slight Delay",
    "Route Diversion"
  ];

  const quickAnnouncements = [
    "Bus will stop for 5 mins",
    "Route diversion ahead", 
    "Last trip for today",
    "Next stop: Major destination",
    "Please move to the back"
  ];

  const handleLocationToggle = () => {
    setIsLiveLocationOn(!isLiveLocationOn);
    toast({
      title: isLiveLocationOn ? "Location sharing stopped" : "Location sharing started",
      description: isLiveLocationOn ? "Passengers will no longer see your live location" : "Passengers can now track your location in real-time",
    });
  };

  const handleStatusUpdate = (newStatus: string) => {
    setBusStatus(newStatus);
    toast({
      title: "Status Updated",
      description: `Bus status changed to: ${newStatus}`,
    });
  };

  const handleEmergency = () => {
    toast({
      title: "Emergency Alert Sent!",
      description: "All passengers have been notified of the emergency situation",
      variant: "destructive",
    });
  };

  const broadcastAnnouncement = (message: string) => {
    if (!message.trim()) return;
    
    toast({
      title: "Announcement Sent",
      description: `"${message}" has been sent to all passengers`,
    });
    setAnnouncement("");
  };

  const updateSeatCount = (change: number) => {
    const newCount = Math.max(0, Math.min(seatCapacity, occupiedSeats + change));
    setOccupiedSeats(newCount);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-surface-primary border-b border-border shadow-card sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Navigation className="w-6 h-6 text-transit-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Driver Dashboard</h1>
              <p className="text-sm text-muted-foreground">{currentRoute}</p>
            </div>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Live Location & Route Progress */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <MapPin className="w-5 h-5 text-transit-primary" />
                Live Location Sharing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Share location with passengers</span>
                <Badge variant={isLiveLocationOn ? "default" : "secondary"}>
                  {isLiveLocationOn ? "Active" : "Inactive"}
                </Badge>
              </div>
              <Button 
                onClick={handleLocationToggle}
                className={`w-full ${isLiveLocationOn ? 'bg-destructive hover:bg-destructive/90' : 'bg-transit-primary hover:bg-transit-primary/90'}`}
              >
                {isLiveLocationOn ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {isLiveLocationOn ? "Stop Sharing" : "Start Sharing"}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <Clock className="w-5 h-5 text-transit-primary" />
                Route Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="text-foreground">{routeProgress}%</span>
                </div>
                <Progress value={routeProgress} className="h-2" />
              </div>
              <div className="space-y-2">
                {routeStops.slice(0, 3).map((stop) => (
                  <div key={stop.id} className="flex items-center justify-between text-sm">
                    <span className={stop.status === 'current' ? 'text-transit-primary font-medium' : 'text-muted-foreground'}>
                      {stop.name}
                    </span>
                    <Badge variant={stop.status === 'completed' ? 'default' : stop.status === 'current' ? 'secondary' : 'outline'}>
                      {stop.estimatedTime}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Updates & Seat Availability */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <AlertTriangle className="w-5 h-5 text-transit-warning" />
                Bus Status Updates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">Current Status</label>
                <Select value={busStatus} onValueChange={handleStatusUpdate}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Badge 
                variant={busStatus === "Running on Time" ? "default" : "destructive"}
                className="w-full justify-center py-2"
              >
                {busStatus}
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <Users className="w-5 h-5 text-transit-success" />
                Seat Availability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-foreground">
                  {occupiedSeats} / {seatCapacity}
                </div>
                <div className="text-sm text-muted-foreground">
                  {seatCapacity - occupiedSeats} seats available
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => updateSeatCount(-1)}
                  className="flex-1"
                >
                  -1
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => updateSeatCount(1)}
                  className="flex-1"
                >
                  +1
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setOccupiedSeats(0)}
                  className="flex-1"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Button */}
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <Button 
              onClick={handleEmergency}
              className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground py-4 text-lg font-semibold"
            >
              <AlertTriangle className="w-6 h-6 mr-2" />
              Emergency Alert
            </Button>
          </CardContent>
        </Card>

        {/* Announcements */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Megaphone className="w-5 h-5 text-transit-primary" />
              Announcements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-card-foreground">Quick Announcements</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {quickAnnouncements.map((msg, index) => (
                  <Button 
                    key={index}
                    variant="outline" 
                    size="sm"
                    onClick={() => broadcastAnnouncement(msg)}
                    className="text-left justify-start"
                  >
                    <Radio className="w-4 h-4 mr-2" />
                    {msg}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-card-foreground">Custom Announcement</label>
              <Textarea 
                placeholder="Type your custom announcement here..."
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                className="min-h-20"
              />
              <Button 
                onClick={() => broadcastAnnouncement(announcement)}
                disabled={!announcement.trim()}
                className="w-full bg-transit-primary hover:bg-transit-primary/90"
              >
                <Radio className="w-4 h-4 mr-2" />
                Broadcast Announcement
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DriverPage;