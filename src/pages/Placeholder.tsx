import { useLocation } from "react-router-dom";

const Placeholder = () => {
  const location = useLocation();
  const pageName = location.pathname.slice(1).toUpperCase() || "HOME";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center pb-16">
      <h1 className="text-2xl font-bold tracking-widest text-muted-foreground">
        {pageName}
      </h1>
    </div>
  );
};

export default Placeholder;
