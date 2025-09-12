import { ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import JourneyChatForm from "@/components/JourneyChatForm";
import { useI18n } from "@/contexts/I18nContext";
import { UserButton } from "@clerk/clerk-react";

interface ChatPageProps {
  onBack: () => void;
}

const ChatPage = ({ onBack }: ChatPageProps) => {
  const { t } = useI18n();

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
            <div className="flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-transit-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">{t('chat.title')}</h1>
                <p className="text-sm text-muted-foreground">{t('chat.subtitle')}</p>
              </div>
            </div>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      <main className="p-4">
        <JourneyChatForm />
      </main>
    </div>
  );
};

export default ChatPage;