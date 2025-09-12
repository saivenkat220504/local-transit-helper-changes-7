import { ArrowLeft, Zap, Bell, Eye, Type, Wifi, Languages } from "lucide-react";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useI18n, Language } from "@/contexts/I18nContext";
import { UserButton } from "@clerk/clerk-react";

interface SettingsPageProps {
  onBack: () => void;
}

const SettingsPage = ({ onBack }: SettingsPageProps) => {
  const [settings, setSettings] = useState({
    dataSaving: false,
    routeAlerts: true,
    highContrast: false,
    largeFonts: false,
    offlineMode: true,
    pushNotifications: true,
  });

  const { language: currentLanguage, setLanguage, t } = useI18n();
  const { toast } = useToast();

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    
    toast({
      title: "Settings Updated",
      description: `${key.replace(/([A-Z])/g, ' $1').toLowerCase()} ${!settings[key] ? 'enabled' : 'disabled'}`,
    });
  };

  const settingsGroups = [
    {
      title: "Data & Performance",
      icon: Zap,
      items: [
        {
          key: "dataSaving" as keyof typeof settings,
          label: "Data Saving Mode",
          description: "Reduces data usage, shows text instead of maps",
          icon: Wifi,
        },
        {
          key: "offlineMode" as keyof typeof settings,
          label: "Offline Timetables",
          description: "Cache route schedules for offline access",
          icon: Zap,
        },
      ],
    },
    {
      title: "Notifications",
      icon: Bell,
      items: [
        {
          key: "routeAlerts" as keyof typeof settings,
          label: "Route Alerts",
          description: "Get notified about delays and route changes",
          icon: Bell,
        },
        {
          key: "pushNotifications" as keyof typeof settings,
          label: "Push Notifications",
          description: "Receive real-time updates and reminders",
          icon: Bell,
        },
      ],
    },
    {
      title: "Accessibility",
      icon: Eye,
      items: [
        {
          key: "highContrast" as keyof typeof settings,
          label: "High Contrast Mode",
          description: "Enhanced visibility with increased contrast",
          icon: Eye,
        },
        {
          key: "largeFonts" as keyof typeof settings,
          label: "Large Text",
          description: "Increase text size for better readability",
          icon: Type,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-surface-primary border-b border-border shadow-card">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="hover:bg-surface-secondary"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">{t('settings.title')}</h1>
              <p className="text-sm text-muted-foreground">{t('settings.subtitle')}</p>
            </div>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      <main className="p-4 space-y-6">
        {settingsGroups.map((group) => {
          const GroupIcon = group.icon;
          return (
            <section key={group.title} className="bg-card rounded-xl p-4 shadow-card border border-border/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-transit-primary/10 flex items-center justify-center">
                  <GroupIcon className="w-4 h-4 text-transit-primary" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">{group.title}</h2>
              </div>
              
              <div className="space-y-4">
                {group.items.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <div key={item.key} className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-surface-secondary flex items-center justify-center mt-1">
                          <ItemIcon className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground">{item.label}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings[item.key]}
                        onCheckedChange={() => handleToggle(item.key)}
                        className="ml-4"
                      />
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}

        {/* Language Selection */}
        <section className="bg-card rounded-xl p-4 shadow-card border border-border/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-transit-primary/10 flex items-center justify-center">
              <Languages className="w-4 h-4 text-transit-primary" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">{t('settings.languageTitle')}</h2>
          </div>
          
          <div className="space-y-3">
            {["English", "Hindi", "Telugu"].map((language) => (
              <button
                key={language}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  currentLanguage === language 
                    ? "bg-transit-primary/10 border border-transit-primary/20" 
                    : "bg-surface-secondary hover:bg-surface-elevated"
                }`}
                onClick={() => {
                  setLanguage(language as Language);
                  toast({
                    title: "Language Changed",
                    description: `Switched to ${language}`,
                  });
                }}
              >
                <span className={`font-medium ${
                  currentLanguage === language ? "text-transit-primary" : "text-foreground"
                }`}>
                  {language}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* About Section */}
        <section className="bg-card rounded-xl p-4 shadow-card border border-border/50">
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-foreground">Transit Tracker v1.0</h3>
            <p className="text-sm text-muted-foreground">
              Built for small cities with ❤️
            </p>
            <p className="text-xs text-muted-foreground">
              Community-powered • Offline-first • Accessible
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SettingsPage;