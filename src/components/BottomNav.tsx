import { useLocation, Link } from "react-router-dom";

const navItems = [
  { label: "HOME", path: "/" },
  { label: "LIBRARY", path: "/library" },
  { label: "QUIZ", path: "/quiz" },
  { label: "RANKS", path: "/ranks" },
  { label: "PROFILE", path: "/profile" },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path === "/ranks" && location.pathname === "/");
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`text-xs font-['Space_Grotesk'] font-semibold tracking-wider transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
