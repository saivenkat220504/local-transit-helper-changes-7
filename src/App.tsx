import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import NavigationBar from "@/components/NavigationBar";
import HomePage from "@/pages/Index";
import SearchPage from "@/pages/SearchPage";
import EcoRewardsPage from "@/pages/EcoRewardsPage";
import SettingsPage from "@/pages/SettingsPage";
import ChatPage from "@/pages/ChatPage";
import DriverPage from "@/pages/DriverPage";
import AuthGate from "@/components/AuthGate";
import RoleSelection from "@/components/RoleSelection";
import { I18nProvider } from "@/contexts/I18nContext";

const queryClient = new QueryClient();

const App = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [userRole, setUserRole] = useState<string | null>(null);
  const { user } = useUser();

  useEffect(() => {
    // Check if user has a role saved in localStorage
    const savedRole = localStorage.getItem("userRole");
    if (savedRole) {
      setUserRole(savedRole);
    }
  }, [user]);

  const handleRoleSelect = (role: string) => {
    setUserRole(role);
    localStorage.setItem("userRole", role);
  };

  const renderContent = () => {
    // Driver gets a single dashboard page
    if (userRole === "driver") {
      return <DriverPage />;
    }
    
    // Passenger navigation
    switch (activeTab) {
      case "home":
        return <HomePage />;
      case "search":
        return <SearchPage />;
      case "eco-rewards":
        return <EcoRewardsPage />;
      case "chat":
        return <ChatPage onBack={() => setActiveTab("home")} />;
      case "settings":
        return <SettingsPage onBack={() => setActiveTab("home")} />;
      default:
        return <HomePage />;
    }
  };

  return (
    <I18nProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          
          <SignedOut>
            <AuthGate />
          </SignedOut>
          
          <SignedIn>
            {!userRole ? (
              <RoleSelection onRoleSelect={handleRoleSelect} />
            ) : (
              <div className="min-h-screen bg-background">
                {renderContent()}
                {userRole === "passenger" && (
                  <NavigationBar activeTab={activeTab} onTabChange={setActiveTab} />
                )}
              </div>
            )}
          </SignedIn>
        </TooltipProvider>
      </QueryClientProvider>
    </I18nProvider>
  );
};

export default App;
