import { useState } from "react";
import { MessageCircle, Send, Clock, User, Bus } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/contexts/I18nContext";

interface JourneyChatData {
  name: string;
  route: string;
  opinion: string;
}

interface ChatPost {
  id: string;
  name: string;
  route: string;
  opinion: string;
  timestamp: Date;
}

const JourneyChatForm = () => {
  const [chatPosts, setChatPosts] = useState<ChatPost[]>([
    // Sample data to simulate past opinions
    {
      id: "1",
      name: "Sarah M.",
      route: "15A",
      opinion: "The bus was 15 minutes late this morning. This happens almost every day on this route. Please improve the schedule reliability.",
      timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
    },
    {
      id: "2", 
      name: "John D.",
      route: "22B",
      opinion: "Great service today! The bus was clean and on time. The driver was very courteous. Keep up the good work!",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
    },
    {
      id: "3",
      name: "Maria L.",
      route: "15A", 
      opinion: "Air conditioning wasn't working properly during peak hours. It was quite uncomfortable for passengers.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4) // 4 hours ago
    },
    {
      id: "4",
      name: "Ahmed K.",
      route: "33C",
      opinion: "Bus stop announcement system is not working. Many passengers, including elderly, are confused about stops.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6) // 6 hours ago
    },
    {
      id: "5",
      name: "Emma W.",
      route: "22B",
      opinion: "Driver was very helpful today. Helped me with directions and was patient with elderly passengers boarding.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8) // 8 hours ago
    }
  ]);
  const [selectedRoute, setSelectedRoute] = useState<string>("all");
  const { toast } = useToast();
  const { t } = useI18n();
  
  const form = useForm<JourneyChatData>({
    defaultValues: {
      name: "",
      route: "",
      opinion: "",
    },
  });

  const onSubmit = (data: JourneyChatData) => {
    const newPost: ChatPost = {
      id: Date.now().toString(),
      name: data.name,
      route: data.route,
      opinion: data.opinion,
      timestamp: new Date(),
    };

    setChatPosts(prev => [newPost, ...prev]);
    form.reset();
    
    toast({
      title: t('chat.opinionPosted'),
      description: t('chat.opinionDescription'),
    });
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const getUniqueRoutes = () => {
    const routes = [...new Set(chatPosts.map(post => post.route))];
    return routes.sort();
  };

  const filteredPosts = selectedRoute === "all" 
    ? chatPosts 
    : chatPosts.filter(post => post.route === selectedRoute);

  const getOpinionSentiment = (opinion: string) => {
    const positiveWords = ['great', 'good', 'excellent', 'helpful', 'courteous', 'clean', 'time'];
    const negativeWords = ['late', 'delayed', 'uncomfortable', 'problem', 'issue', 'broken', 'not working'];
    
    const lowerOpinion = opinion.toLowerCase();
    const hasPositive = positiveWords.some(word => lowerOpinion.includes(word));
    const hasNegative = negativeWords.some(word => lowerOpinion.includes(word));
    
    if (hasPositive && !hasNegative) return 'positive';
    if (hasNegative && !hasPositive) return 'negative';
    return 'neutral';
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-transit-primary" />
        <h2 className="text-lg font-semibold text-foreground">{t('chat.title')}</h2>
      </div>

      {/* Route Filter */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Bus className="w-4 h-4 text-transit-primary" />
            <span className="text-sm font-medium text-foreground">Filter by Route:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedRoute === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedRoute("all")}
              className={selectedRoute === "all" ? "bg-transit-primary text-white" : ""}
            >
              All Routes
            </Button>
            {getUniqueRoutes().map((route) => (
              <Button
                key={route}
                variant={selectedRoute === route ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRoute(route)}
                className={selectedRoute === route ? "bg-transit-primary text-white" : ""}
              >
                Route {route}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Form */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base">{t('chat.formTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  rules={{ required: t('chat.nameRequired') }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('chat.nameLabel')}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={t('chat.namePlaceholder')} 
                          {...field}
                          className="bg-surface-secondary border-border/50 focus:border-transit-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="route"
                  rules={{ required: t('chat.routeRequired') }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('chat.routeLabel')}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={t('chat.routePlaceholder')} 
                          {...field}
                          className="bg-surface-secondary border-border/50 focus:border-transit-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="opinion"
                rules={{ 
                  required: t('chat.opinionRequired'),
                  minLength: { value: 10, message: t('chat.opinionMinLength') }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('chat.opinionLabel')}</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={t('chat.opinionPlaceholder')}
                        className="min-h-[100px] bg-surface-secondary border-border/50 focus:border-transit-primary resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full bg-transit-primary hover:bg-transit-primary/90 text-white"
              >
                <Send className="w-4 h-4 mr-2" />
                {t('chat.postButton')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Passenger Opinions & Feedback */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-transit-primary" />
            Passenger Opinions & Feedback
          </h3>
          <Badge variant="outline" className="text-muted-foreground">
            {filteredPosts.length} {filteredPosts.length === 1 ? 'opinion' : 'opinions'}
          </Badge>
        </div>
        
        {filteredPosts.length === 0 ? (
          <Card className="bg-surface-secondary/30 border-border/50">
            <CardContent className="p-8 text-center">
              <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {selectedRoute === "all" 
                  ? "No opinions posted yet. Be the first to share your experience!"
                  : `No opinions for Route ${selectedRoute} yet.`
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredPosts.map((post) => {
              const sentiment = getOpinionSentiment(post.opinion);
              return (
                <Card key={post.id} className="bg-surface-secondary/50 border-border/50 hover:border-border transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-transit-primary/10 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-transit-primary" />
                          </div>
                          <span className="font-medium text-foreground">{post.name}</span>
                        </div>
                        <Badge 
                          variant="outline" 
                          className="bg-transit-primary/10 text-transit-primary border-transit-primary/20 text-xs"
                        >
                          Route {post.route}
                        </Badge>
                        {sentiment === 'positive' && (
                          <Badge variant="outline" className="bg-transit-success/10 text-transit-success border-transit-success/20 text-xs">
                            👍 Positive
                          </Badge>
                        )}
                        {sentiment === 'negative' && (
                          <Badge variant="outline" className="bg-transit-danger/10 text-transit-danger border-transit-danger/20 text-xs">
                            👎 Issue
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {formatTimestamp(post.timestamp)}
                      </div>
                    </div>
                    <p className="text-sm text-foreground/90 leading-relaxed pl-11">{post.opinion}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default JourneyChatForm;