import { CreditCard, Send, Flag, Clock } from "lucide-react";

interface QuickActionsProps {
  onPayFare: () => void;
  onCatchBus: () => void;
  onReportIssue: () => void;
}

const QuickActions = ({ onPayFare, onCatchBus, onReportIssue }: QuickActionsProps) => {
  const actions = [
    {
      id: "pay",
      label: "Pay Fare",
      icon: CreditCard,
      color: "bg-route-green hover:bg-route-green/90",
      onClick: onPayFare,
    },
    {
      id: "catch",
      label: "Catch Bus?",
      icon: Send,
      color: "bg-transit-primary hover:bg-transit-primary/90",
      onClick: onCatchBus,
    },
    {
      id: "report",
      label: "Report Issue",
      icon: Flag,
      color: "bg-route-orange hover:bg-route-orange/90",
      onClick: onReportIssue,
    },
  ];

  return (
    <div className="bg-card rounded-xl p-4 shadow-card border border-border/50">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-5 h-5 text-transit-primary" />
        <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={action.onClick}
              className={`
                ${action.color} text-white p-4 rounded-lg
                transition-all duration-200 hover:shadow-glow
                flex flex-col items-center gap-2
              `}
            >
              <Icon size={24} />
              <span className="text-sm font-medium">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;