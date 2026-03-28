import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DUMMY_ADMIN_ACCOUNT,
  isAdminAuthenticated,
  setAdminAuthenticated,
  validateAdminCredentials,
} from "@/lib/adminAuth";

const DEFAULT_AFTER_LOGIN = "/admin/dashboard";

function resolveAfterLogin(stateFrom: string | undefined): string {
  if (!stateFrom) return DEFAULT_AFTER_LOGIN;
  if (stateFrom === "/admin" || stateFrom === "/admin/login") return DEFAULT_AFTER_LOGIN;
  return stateFrom;
}

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = resolveAfterLogin((location.state as { from?: string } | null)?.from);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAdminAuthenticated()) navigate(from, { replace: true });
  }, [from, navigate]);

  if (isAdminAuthenticated()) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (validateAdminCredentials(email, password)) {
      setAdminAuthenticated(true);
      navigate(from, { replace: true });
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col justify-center px-4 py-10 sm:px-6">
      <div className="mx-auto w-full max-w-md rounded-xl border border-border bg-background p-8 sm:p-10 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-['Space_Grotesk'] mb-2">
          Admin · staff only
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground font-['Space_Grotesk'] tracking-tight mb-1">
          Admin sign in
        </h1>
        <p className="text-sm text-muted-foreground font-['Space_Grotesk'] mb-6">
          Not the member app. Sign in with your admin email and password.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email" className="font-['Space_Grotesk']">
              Email
            </Label>
            <Input
              id="admin-email"
              type="email"
              autoComplete="username"
              placeholder={DUMMY_ADMIN_ACCOUNT.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="font-['Space_Grotesk'] rounded-xl h-11"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password" className="font-['Space_Grotesk']">
              Password
            </Label>
            <Input
              id="admin-password"
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="font-['Space_Grotesk'] rounded-xl h-11"
              required
            />
          </div>
          {error && (
            <p className="text-sm text-destructive font-['Space_Grotesk']" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full h-11 rounded-xl font-['Space_Grotesk'] font-semibold mt-2">
            Sign in to dashboard
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground font-['Space_Grotesk'] mt-6">
          <Link to="/" className="text-primary font-medium hover:underline">
            Return to app home
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
