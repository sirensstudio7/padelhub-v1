import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import { getEventById } from "@/data/events";
import {
  addRegistrationForEvent,
  generateRegistrationDisplayName,
  getRegistrationSlotsUsed,
} from "@/data/eventRegistrations";
import { getTournamentRegistrationCapacity } from "@/lib/eventTournamentBracket";
import { useEventRegistrations } from "@/hooks/useEventRegistrations";
import { addRegistrationSuccessNotification } from "@/data/registrationNotifications";
import { useProfileOverrides } from "@/contexts/ProfileOverridesContext";
import { getStoredProfileNameOverride } from "@/data/playerProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import NotFound from "./NotFound";

const TSHIRT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;

const EventRegister = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { setOverrides } = useProfileOverrides();
  const event = eventId ? getEventById(eventId) : null;
  const registrations = useEventRegistrations(eventId);
  const registrationCapacity = event ? getTournamentRegistrationCapacity(event) : null;
  const registrationFull =
    event != null &&
    registrationCapacity != null &&
    getRegistrationSlotsUsed(event.id) >= registrationCapacity;

  const [{ displayName, nameFromProfile }] = useState(() => {
    const stored = getStoredProfileNameOverride();
    if (stored) return { displayName: stored, nameFromProfile: true as const };
    return {
      displayName: generateRegistrationDisplayName(),
      nameFromProfile: false as const,
    };
  });
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState<"m" | "f" | "">("");
  const [tshirtSize, setTshirtSize] = useState<string>("");

  if (!event) return <NotFound />;

  if (registrationFull) {
    return (
      <div className="min-h-[100dvh] bg-background pb-[calc(5.25rem+env(safe-area-inset-bottom,0px))]">
        <header className="sticky top-0 z-40 border-b border-border bg-background">
          <div className="mx-auto flex max-w-lg items-center gap-2 px-4 py-4">
            <Link
              to={`/event/${event.id}`}
              className="shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Back to event"
            >
              <HugeiconsIcon icon={ArrowLeft02Icon} size={24} color="currentColor" strokeWidth={1.5} />
            </Link>
            <h1 className="flex-1 text-center text-xl font-semibold font-['Space_Grotesk'] text-foreground">
              Register
            </h1>
            <div className="w-10 shrink-0" aria-hidden />
          </div>
        </header>
        <div className="mx-auto max-w-lg px-4 py-8">
          <p className="text-sm text-muted-foreground font-['Space_Grotesk']">{event.title}</p>
          <p className="mt-4 text-sm leading-relaxed text-foreground font-['Space_Grotesk']">
            This tournament has reached capacity ({registrationCapacity} player
            {registrationCapacity === 1 ? "" : "s"}). Registration is closed.
          </p>
          <Button
            asChild
            className="mt-8 h-11 w-full rounded-xl font-['Space_Grotesk'] font-semibold shadow-sm"
          >
            <Link to={`/event/${event.id}`}>Back to event</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cap = getTournamentRegistrationCapacity(event);
    if (cap != null && getRegistrationSlotsUsed(event.id) >= cap) {
      toast.error("This tournament is full.");
      navigate(`/event/${event.id}`, { replace: true });
      return;
    }
    if (!phone.trim()) {
      toast.error("Phone number is required");
      return;
    }
    if (!address.trim()) {
      toast.error("Address is required");
      return;
    }
    if (!gender) {
      toast.error("Please select gender");
      return;
    }
    if (!tshirtSize) {
      toast.error("Please select T-shirt size");
      return;
    }
    const registration = addRegistrationForEvent(event.id, {
      name: displayName,
      phone: phone.trim(),
      address: address.trim(),
      gender,
      tshirtSize,
    });
    setOverrides({ name: displayName.trim() });
    addRegistrationSuccessNotification(event.id, event.title);
    navigate(`/event/${event.id}/register/success`, {
      replace: true,
      state: { registration },
    });
  };

  return (
    <div className="min-h-[100dvh] bg-background pb-[calc(5.25rem+env(safe-area-inset-bottom,0px))]">
      <header className="sticky top-0 z-40 border-b border-border bg-background">
        <div className="mx-auto flex max-w-lg items-center gap-2 px-4 py-4">
          <Link
            to={`/event/${event.id}`}
            className="shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Back to event"
          >
            <HugeiconsIcon icon={ArrowLeft02Icon} size={24} color="currentColor" strokeWidth={1.5} />
          </Link>
          <h1 className="flex-1 text-center text-xl font-semibold font-['Space_Grotesk'] text-foreground">
            Register
          </h1>
          <div className="w-10 shrink-0" aria-hidden />
        </div>
      </header>

      <div className="mx-auto max-w-lg px-4 py-6">
        <p className="text-sm text-muted-foreground font-['Space_Grotesk']">
          {event.title}
        </p>

        <form id="event-register-form" onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
          <div className="space-y-2">
            <Label htmlFor="reg-name" className="font-['Space_Grotesk']">
              Name
            </Label>
            <Input
              id="reg-name"
              readOnly
              value={displayName}
              className="h-11 cursor-default rounded-xl bg-muted font-['Space_Grotesk']"
              tabIndex={-1}
              aria-readonly="true"
            />
            <p className="text-xs text-muted-foreground font-['Space_Grotesk']">
              {nameFromProfile
                ? "Uses the name saved on your profile (signup or past registration)."
                : "Random demo name for this signup — submit to save it to your profile."}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reg-phone" className="font-['Space_Grotesk']">
              Phone number
            </Label>
            <Input
              id="reg-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+62 …"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-11 rounded-xl font-['Space_Grotesk']"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reg-address" className="font-['Space_Grotesk']">
              Address
            </Label>
            <Textarea
              id="reg-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street, city, postal code…"
              autoComplete="street-address"
              className="min-h-[100px] rounded-xl font-['Space_Grotesk']"
              required
            />
          </div>

          <div className="space-y-3">
            <Label className="font-['Space_Grotesk']">Gender</Label>
            <RadioGroup
              value={gender}
              onValueChange={(v) => setGender(v as "m" | "f")}
              className="flex gap-6"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="m" id="reg-g-m" />
                <Label htmlFor="reg-g-m" className="cursor-pointer font-normal font-['Space_Grotesk']">
                  M
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="f" id="reg-g-f" />
                <Label htmlFor="reg-g-f" className="cursor-pointer font-normal font-['Space_Grotesk']">
                  F
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reg-tshirt" className="font-['Space_Grotesk']">
              T-shirt size
            </Label>
            <Select value={tshirtSize} onValueChange={setTshirtSize}>
              <SelectTrigger id="reg-tshirt" className="h-11 rounded-xl font-['Space_Grotesk']">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                {TSHIRT_SIZES.map((s) => (
                  <SelectItem key={s} value={s} className="font-['Space_Grotesk']">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </form>
      </div>

      <nav
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/80"
        aria-label="Submit registration"
      >
        <div className="mx-auto max-w-lg px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <Button
            type="submit"
            form="event-register-form"
            className="h-11 w-full rounded-xl font-['Space_Grotesk'] font-semibold shadow-sm"
          >
            Submit registration
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default EventRegister;
