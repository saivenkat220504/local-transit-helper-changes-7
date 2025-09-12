import { Leaf, Trophy, Users, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useI18n } from "@/contexts/I18nContext";
import { UserButton } from "@clerk/clerk-react";

const EcoRewardsPage = () => {
  const { toast } = useToast();
  const { t } = useI18n();
  const [totalPoints, setTotalPoints] = useState(1250);
  const [claimedRewards, setClaimedRewards] = useState<number[]>([]);

  const rewards = [
    { id: 1, title: "Weekly Rider", description: "Take 10 bus rides this week", points: 50, completed: true },
    { id: 2, title: "Carbon Saver", description: "Save 5kg CO2 this month", points: 100, completed: false },
    { id: 3, title: "Community Helper", description: "Report 3 transit updates", points: 30, completed: true },
  ];
  const handleClaimReward = (rewardId: number, points: number) => {
    if (!claimedRewards.includes(rewardId)) {
      setTotalPoints(prev => prev + points);
      setClaimedRewards(prev => [...prev, rewardId]);
    }
  };

  const achievements = [
    { id: 1, title: "Eco Warrior", icon: Leaf, earned: true },
    { id: 2, title: "Transit Champion", icon: Trophy, earned: true },
    { id: 3, title: "Community Leader", icon: Users, earned: false },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-surface-primary border-b border-border shadow-card">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3 mb-4">
            <Leaf className="w-6 h-6 text-transit-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">{t('ecoRewards.title')}</h1>
              <p className="text-sm text-muted-foreground">{t('ecoRewards.subtitle')}</p>
            </div>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
        
        {/* Points Summary */}
        <div className="px-4 pb-4">
          <div className="bg-gradient-to-r from-transit-primary to-route-green p-4 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold">{totalPoints.toLocaleString()} Points</p>
                <p className="text-sm opacity-90">This month</p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90">Rank #42</p>
                <p className="text-xs opacity-80">City leaderboard</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Active Challenges */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-transit-primary" />
            Active Challenges
          </h2>
          
          <div className="space-y-3">
            {rewards.map((reward) => (
              <div key={reward.id} className="bg-card p-4 rounded-xl border border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-foreground">{reward.title}</h3>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    reward.completed 
                      ? 'bg-status-online/20 text-status-online' 
                      : 'bg-transit-warning/20 text-transit-warning'
                  }`}>
                    {reward.completed ? 'Completed' : 'In Progress'}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{reward.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-transit-primary">
                    +{reward.points} points
                  </span>
                  {reward.completed && !claimedRewards.includes(reward.id) && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="px-3 py-1 bg-transit-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-transit-primary/90 transition-colors">
                          Claim
                        </button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Reward Claimed!</DialogTitle>
                          <DialogDescription>
                            Congratulations! You've earned {reward.points} points. A discount coupon will be sent to your email within 24 hours.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end mt-4">
                          <button
                            onClick={() => {
                              handleClaimReward(reward.id, reward.points);
                              toast({ 
                                title: "Reward Claimed!", 
                                description: `+${reward.points} points added. Coupon will be sent to your email.` 
                              });
                            }}
                            className="px-4 py-2 bg-transit-primary text-primary-foreground rounded-lg font-medium hover:bg-transit-primary/90 transition-colors"
                          >
                            Confirm
                          </button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                  {claimedRewards.includes(reward.id) && (
                    <span className="px-3 py-1 bg-status-online/20 text-status-online rounded-lg text-sm font-medium">
                      Claimed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Achievements */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-transit-primary" />
            Achievements
          </h2>
          
          <div className="grid grid-cols-3 gap-3">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <div key={achievement.id} className={`p-4 rounded-xl border text-center ${
                  achievement.earned
                    ? 'bg-card border-transit-primary/20'
                    : 'bg-surface-secondary border-border/50 opacity-50'
                }`}>
                  <Icon className={`w-8 h-8 mx-auto mb-2 ${
                    achievement.earned ? 'text-transit-primary' : 'text-muted-foreground'
                  }`} />
                  <p className="text-xs font-medium text-foreground">{achievement.title}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Impact Stats */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Your Impact</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card p-4 rounded-xl border border-border/50">
              <div className="text-center">
                <p className="text-2xl font-bold text-status-online">42.5kg</p>
                <p className="text-sm text-muted-foreground">CO2 Saved</p>
              </div>
            </div>
            <div className="bg-card p-4 rounded-xl border border-border/50">
              <div className="text-center">
                <p className="text-2xl font-bold text-route-blue">156</p>
                <p className="text-sm text-muted-foreground">Bus Rides</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default EcoRewardsPage;