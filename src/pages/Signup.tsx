import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, UserRound } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfileOverrides } from "@/contexts/ProfileOverridesContext";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ACCOUNT_ROLE_STORAGE_KEY } from "@/lib/accountRole";
import SafeImage from "@/components/SafeImage";

const TSHIRT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;
const GENDER_OPTIONS = ["Male", "Female"] as const;

const Signup = () => {
  const navigate = useNavigate();
  const { isLoggedIn, login } = useAuth();
  const { setOverrides } = useProfileOverrides();
  const [accountType, setAccountType] = useState<"player" | "club">("player");
  const [name, setName] = useState("");
  const [clubName, setClubName] = useState("");
  const [clubOwnerName, setClubOwnerName] = useState("");
  const [clubCity, setClubCity] = useState("");
  const [clubSocialInstagram, setClubSocialInstagram] = useState("");
  const [clubSocialFacebook, setClubSocialFacebook] = useState("");
  const [clubSocialWebsite, setClubSocialWebsite] = useState("");
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
    if (!email.trim() || password.length < 6 || password !== confirmPassword) return;

    if (accountType === "player") {
      if (!name.trim() || !tshirtSize || !gender) return;
      setOverrides({
        name: name.trim(),
        clubOwnerName: null,
        clubSocialInstagram: null,
        clubSocialFacebook: null,
        clubSocialWebsite: null,
      });
    } else {
      if (!clubName.trim() || !clubOwnerName.trim()) return;
      setOverrides({
        name: clubName.trim(),
        ...(clubCity.trim() ? { location: clubCity.trim() } : { location: null }),
        clubOwnerName: clubOwnerName.trim(),
        clubSocialInstagram: clubSocialInstagram.trim() || null,
        clubSocialFacebook: clubSocialFacebook.trim() || null,
        clubSocialWebsite: clubSocialWebsite.trim() || null,
      });
    }

    try {
      localStorage.setItem(ACCOUNT_ROLE_STORAGE_KEY, accountType);
    } catch {
      /* ignore */
    }
    login();
    navigate("/onboarding", { replace: true });
  };

  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;
  const canSubmitPlayer =
    name.trim() && email.trim() && tshirtSize && gender && password.length >= 6 && password === confirmPassword;
  const canSubmitClub =
    clubName.trim() &&
    clubOwnerName.trim() &&
    email.trim() &&
    password.length >= 6 &&
    password === confirmPassword;
  const canSubmit = accountType === "player" ? canSubmitPlayer : canSubmitClub;

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
          Sign up as a player to track rankings, or as a club to manage your venue on PadelHub
        </p>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <Tabs
            value={accountType}
            onValueChange={(v) => setAccountType(v as "player" | "club")}
            className="w-full"
          >
            <TabsList className="grid h-11 w-full grid-cols-2 gap-1 rounded-xl p-1">
              <TabsTrigger
                value="player"
                className="gap-2 rounded-lg font-['Space_Grotesk'] text-xs sm:text-sm"
              >
                <UserRound className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
                Player
              </TabsTrigger>
              <TabsTrigger
                value="club"
                className="gap-2 rounded-lg font-['Space_Grotesk'] text-xs sm:text-sm"
              >
                <Building2 className="h-4 w-4 shrink-0" aria-hidden />
                Club
              </TabsTrigger>
            </TabsList>

            <TabsContent value="player" className="mt-4 flex flex-col gap-4 outline-none">
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
                />
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
            </TabsContent>

            <TabsContent value="club" className="mt-4 flex flex-col gap-4 outline-none">
              <div className="space-y-2">
                <Label htmlFor="signup-club-name" className="font-['Space_Grotesk']">
                  Club name
                </Label>
                <Input
                  id="signup-club-name"
                  type="text"
                  placeholder="Your club or venue name"
                  value={clubName}
                  onChange={(e) => setClubName(e.target.value)}
                  className="font-['Space_Grotesk'] rounded-xl h-11"
                  autoComplete="organization"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-club-owner" className="font-['Space_Grotesk']">
                  Owner / contact name
                </Label>
                <Input
                  id="signup-club-owner"
                  type="text"
                  placeholder="Full name of the person managing this account"
                  value={clubOwnerName}
                  onChange={(e) => setClubOwnerName(e.target.value)}
                  className="font-['Space_Grotesk'] rounded-xl h-11"
                  autoComplete="name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-club-city" className="font-['Space_Grotesk']">
                  City / area <span className="font-normal text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  id="signup-club-city"
                  type="text"
                  placeholder="e.g. Jakarta"
                  value={clubCity}
                  onChange={(e) => setClubCity(e.target.value)}
                  className="font-['Space_Grotesk'] rounded-xl h-11"
                  autoComplete="address-level2"
                />
              </div>
              <div className="space-y-3 rounded-xl border border-border bg-muted/20 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground font-['Space_Grotesk']">
                  Social media <span className="font-normal normal-case text-muted-foreground/80">(optional)</span>
                </p>
                <div className="space-y-2">
                  <Label htmlFor="signup-club-ig" className="text-[13px] font-['Space_Grotesk']">
                    Instagram
                  </Label>
                  <Input
                    id="signup-club-ig"
                    type="text"
                    placeholder="@yourclub or profile URL"
                    value={clubSocialInstagram}
                    onChange={(e) => setClubSocialInstagram(e.target.value)}
                    className="font-['Space_Grotesk'] rounded-xl h-11"
                    autoComplete="off"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-club-fb" className="text-[13px] font-['Space_Grotesk']">
                    Facebook
                  </Label>
                  <Input
                    id="signup-club-fb"
                    type="text"
                    placeholder="Page name or profile URL"
                    value={clubSocialFacebook}
                    onChange={(e) => setClubSocialFacebook(e.target.value)}
                    className="font-['Space_Grotesk'] rounded-xl h-11"
                    autoComplete="off"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-club-web" className="text-[13px] font-['Space_Grotesk']">
                    Website or other link
                  </Label>
                  <Input
                    id="signup-club-web"
                    type="text"
                    placeholder="Website, TikTok, or other link"
                    value={clubSocialWebsite}
                    onChange={(e) => setClubSocialWebsite(e.target.value)}
                    className="font-['Space_Grotesk'] rounded-xl h-11"
                    autoComplete="off"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

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
              minLength={6}
            />
            {passwordsMismatch && (
              <p className="text-xs text-destructive font-['Space_Grotesk']">Passwords do not match</p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full h-11 rounded-xl font-['Space_Grotesk'] font-semibold mt-2"
            disabled={!canSubmit}
          >
            {accountType === "club" ? "Create Club" : "Create account"}
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
