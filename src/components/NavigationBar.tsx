import { Home, Search, Leaf, Settings, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/contexts/I18nContext";
import { UserButton } from "@clerk/clerk-react";

interface NavigationBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const NavigationBar = ({ activeTab, onTabChange }: NavigationBarProps) => {
  const { t } = useI18n();
  const tabs = [
    { id: "home", icon: Home, label: t("nav.home") },
    { id: "search", icon: Search, label: t("nav.search") },
    { id: "eco-rewards", icon: Leaf, label: t("nav.ecoRewards") },
    { id: "chat", icon: MessageCircle, label: t("nav.chat") },
    { id: "settings", icon: Settings, label: t("nav.settings") },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface-primary border-t border-border shadow-elevated z-50">
      <div className="flex items-center justify-between py-2 px-4">
        <div className="flex items-center justify-around flex-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200",
                  isActive 
                    ? "bg-transit-primary text-primary-foreground shadow-glow" 
                    : "text-muted-foreground hover:text-foreground hover:bg-surface-secondary"
                )}
              >
                <Icon size={20} />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
        <div className="ml-4">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;