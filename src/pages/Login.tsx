import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { DEMO_MEMBER_ACCOUNTS, validateDemoMemberLogin } from "@/data/demoMemberAccounts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SafeImage from "@/components/SafeImage";

const Login = () => {
  const navigate = useNavigate();
  const { isLoggedIn, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoggedIn) navigate("/", { replace: true });
  }, [isLoggedIn, navigate]);
  if (isLoggedIn) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (validateDemoMemberLogin(email, password)) {
      login();
      navigate("/", { replace: true });
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      <div className="max-w-lg mx-auto w-full px-4 py-10 flex-1 flex flex-col justify-center">
        <div className="flex justify-start mb-8">
          <Link to="/" className="inline-flex items-center" aria-label="The Hub Ranking home">
            <SafeImage
              src="/the-hub.png"
              alt="THE PRIME SERIES HUB Ranking"
              className="h-24 w-auto object-contain object-left"
              fallback={
                <span className="text-2xl font-bold text-primary font-['Space_Grotesk']">
                  THE HUB Ranking
                </span>
              }
            />
          </Link>
        </div>

        <p className="text-xs font-semibold uppercase tracking-wider text-primary font-['Space_Grotesk'] mb-2">
          Member
        </p>
        <h1 className="text-2xl font-bold text-foreground font-['Space_Grotesk'] tracking-tight mb-1">
          Sign in
        </h1>
        <p className="text-sm text-muted-foreground font-['Space_Grotesk'] mb-6">
          Use your member email and password for the app.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label htmlFor="login-email" className="font-['Space_Grotesk']">
              Email
            </Label>
            <Input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="font-['Space_Grotesk'] rounded-xl h-11"
              autoComplete="email"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="login-password" className="font-['Space_Grotesk']">
              Password
            </Label>
            <Input
              id="login-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="font-['Space_Grotesk'] rounded-xl h-11"
              autoComplete="current-password"
              required
            />
          </div>
          {error && (
            <p className="text-sm text-destructive font-['Space_Grotesk']" role="alert">
              {error}
            </p>
          )}
          <Button
            type="submit"
            className="w-full h-11 rounded-xl font-['Space_Grotesk'] font-semibold mt-2"
          >
            Sign in as member
          </Button>
        </form>

        <details className="mt-6 rounded-xl border border-border bg-muted/30 px-4 py-3 text-left">
          <summary className="cursor-pointer text-xs font-medium text-muted-foreground font-['Space_Grotesk']">
            Demo accounts (local / staging)
          </summary>
          <ul className="mt-3 space-y-2 text-xs text-muted-foreground font-['Space_Grotesk']">
            {DEMO_MEMBER_ACCOUNTS.map((a) => (
              <li key={a.email} className="break-all">
                <span className="text-foreground">{a.email}</span>
                <span className="mx-1.5 text-border">·</span>
                <span className="tabular-nums">{a.password}</span>
              </li>
            ))}
          </ul>
        </details>

        <p className="text-center text-sm text-muted-foreground font-['Space_Grotesk'] mt-6">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-primary font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
