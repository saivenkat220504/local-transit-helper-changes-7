import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogIn, Users } from "lucide-react";

const AuthGate = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <SignedOut>
        <Card className="w-full max-w-md bg-card border-border">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Users className="w-12 h-12 text-transit-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Welcome to Transit Hub
            </CardTitle>
            <p className="text-muted-foreground">
              Sign in with Google to access your personalized transit experience
            </p>
          </CardHeader>
          <CardContent>
            <SignInButton mode="modal" fallbackRedirectUrl="/">
              <Button className="w-full bg-transit-primary hover:bg-transit-primary/90 text-white">
                <LogIn className="w-4 h-4 mr-2" />
                Sign in with Google
              </Button>
            </SignInButton>
          </CardContent>
        </Card>
      </SignedOut>
      
      <SignedIn>
        <div className="text-center">
          <UserButton afterSignOutUrl="/" />
          <p className="mt-4 text-foreground">Signed in successfully!</p>
        </div>
      </SignedIn>
    </div>
  );
};

export default AuthGate;