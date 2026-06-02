import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ColorThemeProvider } from "./contexts/ColorThemeContext";
import TopAccessibilityBar from "./components/TopAccessibilityBar";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Pricing from "./pages/Pricing";
import Privacy from "./pages/Privacy";
import HowToUse from "./pages/HowToUse";
import ClientView from "./pages/ClientView";
import Skins from "./pages/Skins";
import Landing from "./pages/Landing";
import Scenarios from "./pages/Scenarios";
import LicenceGate from "./components/LicenceGate";
import BackToTop from "./components/BackToTop";
import Admin from "./pages/Admin";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Coordinators from "./pages/Coordinators";

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location]);
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/demo">
        <Home isDemo={true} />
      </Route>
      <Route path="/editor">
        <LicenceGate>
          <Home isDemo={false} />
        </LicenceGate>
      </Route>
      <Route path="/pricing" component={Pricing} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/how-to-use" component={HowToUse} />
      <Route path="/view" component={ClientView} />
      <Route path="/skins" component={Skins} />
      <Route path="/scenarios" component={Scenarios} />
      <Route path="/admin" component={Admin} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug">{(params) => <BlogPost slug={params.slug} />}</Route>
      <Route path="/coordinators" component={Coordinators} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

// Pages that should show the Back button in the top bar
const BACK_ROUTES: Record<string, { href: string; label: string }> = {
  "/demo":      { href: "/",          label: "← Home" },
  "/editor":    { href: "/",          label: "← Home" },
  "/pricing":   { href: "/",          label: "← Home" },
  "/how-to-use":{ href: "/",          label: "← Home" },
  "/scenarios": { href: "/",          label: "← Home" },
  "/privacy":   { href: "/",          label: "← Home" },
  "/view":      { href: "/",          label: "← Home" },
  "/skins":     { href: "/",          label: "← Home" },
  "/blog":      { href: "/",          label: "← Home" },
  "/coordinators": { href: "/",       label: "← Home" },
  "/404":       { href: "/",          label: "← Home" },
};

function BackAwareBar() {
  const [location] = useLocation();
  let backRoute = BACK_ROUTES[location];

  // Helper: did the user navigate here from /coordinators?
  const fromCoordinators = sessionStorage.getItem("insync_back_to") === "coordinators";
  const fromDemo = sessionStorage.getItem("insync_back_to") === "demo";

  // On /view and /skins: prefer coordinators → demo → home
  if ((location === "/view" || location === "/skins") && backRoute) {
    if (fromCoordinators) {
      backRoute = { href: "/coordinators", label: "← Coordinators" };
    } else if (fromDemo) {
      backRoute = { href: "/demo", label: "← Demo" };
    }
  }

  // On /pricing: go back to coordinators if that's where they came from
  if (location === "/pricing" && backRoute && fromCoordinators) {
    backRoute = { href: "/coordinators", label: "← Coordinators" };
  }

  // Clear the sessionStorage key when the user navigates back to the source page
  useEffect(() => {
    if (location === "/coordinators") {
      sessionStorage.removeItem("insync_back_to");
    }
  }, [location]);

  const hideHamburger = location === "/demo" || location === "/view";
  return (
    <TopAccessibilityBar
      showBack={!!backRoute}
      backHref={backRoute?.href}
      backLabel={backRoute?.label}
      showHamburger={!hideHamburger}
    />
  );
}

// Show back-to-top on all pages except the editor, client view, and admin
const NO_BACK_TO_TOP = ["/editor", "/demo", "/view", "/admin"];

function BackToTopWrapper() {
  const [location] = useLocation();
  if (NO_BACK_TO_TOP.includes(location)) return null;
  return <BackToTop />;
}

function App() {
  return (
    <ErrorBoundary>
      <ColorThemeProvider>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster
            toastOptions={{
              style: {
                background: "oklch(0.13 0.06 155)",
                border: "1.5px solid oklch(0.72 0.14 75 / 40%)",
                color: "oklch(0.96 0.01 78)",
              },
            }}
          />
          <BackAwareBar />
          <ScrollToTop />
          <BackToTopWrapper />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
      </ColorThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
