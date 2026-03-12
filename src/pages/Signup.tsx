import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SafeImage from "@/components/SafeImage";

const TSHIRT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;
const GENDER_OPTIONS = ["Male", "Female"] as const;

const Signup = () => {
  const navigate = useNavigate();
  const { isLoggedIn, login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [tshirtSize, setTshirtSize] = useState<string>("");
  const [gender, setGender] = useState<string>("");

  useEffect(() => {
    if (isLoggedIn) navigate("/", { replace: true });
  }, [isLoggedIn, navigate]);

  if (isLoggedIn) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return;
    login();
    navigate("/onboarding", { replace: true });
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

        <h1 className="text-2xl font-bold text-foreground font-['Space_Grotesk'] tracking-tight mb-1">
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground font-['Space_Grotesk'] mb-6">
          Join PadelHub to track rankings and connect with clubs
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label htmlFor="signup-name" className="font-['Space_Grotesk']">
              Name
            </Label>
            <Input
              id="signup-name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="font-['Space_Grotesk'] rounded-xl h-11"
              autoComplete="name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-email" className="font-['Space_Grotesk']">
              Email
            </Label>
            <Input
              id="signup-email"
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
            <Label htmlFor="signup-password" className="font-['Space_Grotesk']">
              Password
            </Label>
            <Input
              id="signup-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="font-['Space_Grotesk'] rounded-xl h-11"
              autoComplete="new-password"
              required
              minLength={6}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-confirm" className="font-['Space_Grotesk']">
              Confirm password
            </Label>
            <Input
              id="signup-confirm"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="font-['Space_Grotesk'] rounded-xl h-11"
              autoComplete="new-password"
              required
              minLength={6}
            />
            {confirmPassword && password !== confirmPassword && (
              <p className="text-xs text-destructive font-['Space_Grotesk']">
                Passwords do not match
              </p>
            )}
          </div>
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="signup-tshirt" className="font-['Space_Grotesk']">
                Jersey size
              </Label>
              <Select value={tshirtSize} onValueChange={setTshirtSize}>
                <SelectTrigger
                  id="signup-tshirt"
                  className="font-['Space_Grotesk'] rounded-xl h-11"
                >
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {TSHIRT_SIZES.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="signup-gender" className="font-['Space_Grotesk']">
                Gender
              </Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger
                  id="signup-gender"
                  className="font-['Space_Grotesk'] rounded-xl h-11"
                >
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {GENDER_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full h-11 rounded-xl font-['Space_Grotesk'] font-semibold mt-2"
            disabled={(password !== confirmPassword && confirmPassword.length > 0) || !tshirtSize || !gender}
          >
            Create account
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground font-['Space_Grotesk'] mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
