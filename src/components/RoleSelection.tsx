import { useState } from "react";
import { UserCheck, Car, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/contexts/I18nContext";

interface RoleSelectionProps {
  onRoleSelect: (role: string) => void;
}

const RoleSelection = ({ onRoleSelect }: RoleSelectionProps) => {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const { t } = useI18n();

  const roles = [
    {
      id: "driver",
      title: "Driver",
      description: "I drive buses and provide transportation services",
      icon: Car,
      color: "bg-blue-500"
    },
    {
      id: "passenger", 
      title: "Passenger",
      description: "I use public transportation services",
      icon: Users,
      color: "bg-green-500"
    }
  ];

  const handleConfirm = () => {
    if (selectedRole) {
      onRoleSelect(selectedRole);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <UserCheck className="w-12 h-12 text-transit-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Select Your Role
          </CardTitle>
          <p className="text-muted-foreground">
            Please select your role to continue using the app
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <div
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedRole === role.id
                    ? "border-transit-primary bg-transit-primary/5"
                    : "border-border hover:border-transit-primary/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${role.color} text-white`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{role.title}</h3>
                    <p className="text-sm text-muted-foreground">{role.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
          
          <Button 
            onClick={handleConfirm}
            disabled={!selectedRole}
            className="w-full bg-transit-primary hover:bg-transit-primary/90 text-white mt-6"
          >
            Continue as {selectedRole === "driver" ? "Driver" : selectedRole === "passenger" ? "Passenger" : ""}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleSelection;