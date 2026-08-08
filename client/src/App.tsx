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
import AlliedHealth from "./pages/AlliedHealth";
import Contact from "./pages/Contact";
import Guides from "./pages/Guides";
import Directory from "./pages/Directory";
import AboutMeEditor from "./pages/AboutMeEditor";
import AboutMeView from "./pages/AboutMeView";
import Ecosystem from "./pages/Ecosystem";
import About from "./pages/About";

// Clean redirect for Sarah Torens OT demo profile
const SARAH_OT_URL = "https://insyncprofiles.net/view?name=Sarah+Torens&title=Occupational+Therapist&tagline=I+meet+you+where+you+are+%E2%80%94+and+we+go+from+there.&roleType=allied-health&bio=Hi%2C+I%27m+Sarah+%E2%80%94+an+OT+based+in+Queensland+with+a+special+interest+in+working+with+children+and+young+people+with+intellectual+and+developmental+disabilities.%0A%0AI+believe+the+best+therapy+happens+when+the+person+in+front+of+me+is+actually+part+of+it.+That+means+starting+with+what+they+love%2C+what+lights+them+up%2C+and+what+matters+to+their+family+%E2%80%94+not+a+checklist.%0A%0AAs+an+OT%2C+I+work+on+the+things+that+matter+in+everyday+life+%E2%80%94+building+independence+in+daily+living+tasks%2C+assessing+functional+capacity%2C+recommending+assistive+technology%2C+supporting+sensory+regulation%2C+and+helping+participants+and+their+families+develop+strategies+they+can+use+between+sessions.+I+also+work+closely+with+schools%2C+carers%2C+and+support+teams+to+make+sure+the+plan+carries+through+everywhere+it+needs+to.%0A%0AI+work+across+remote+and+regional+Queensland+and+I%27m+experienced+in+supporting+participants+with+global+developmental+delay%2C+low+muscle+tone%2C+and+building+walking+endurance+through+fun%2C+meaningful+activity.%0A%0ABefore+I+travel+to+your+town%2C+I%27d+love+to+hear+from+Ky+and+the+family.+If+Ky+wants+to+let+me+know+anything+%E2%80%94+what+he%27s+excited+about%2C+what+he%27s+worried+about%2C+or+just+say+hi+%E2%80%94+he+can+use+the+Speak+to+Message+button+or+the+AAC+board+on+this+page.+No+typing+needed.%0A%0AI%27m+registered+with+AHPRA+and+a+member+of+Occupational+Therapy+Australia.+I+hold+a+current+NDIS+Worker+Screening+Check%2C+Blue+Card%2C+and+full+professional+indemnity+insurance.&email=sarah.torens%40example.com.au&phone=0400+000+000&location=Queensland+%28Remote+%26+Regional%29&ctaText=MESSAGE+TO+BEGIN&video=https%3A%2F%2Fyoutube.com%2Fshorts%2F_e1uvuez1NI%3Fsi%3DjGkN2eZw0Zxkdj9z&photo=https%3A%2F%2Fres.cloudinary.com%2Fdqacbq4qp%2Fimage%2Fupload%2Fv1784180622%2Frldbl1imhhtmixkt4qmq.png&services=ot%2Csensory-processing%2Cassistive-tech%2Ccapacity-building%2Chome-visits%2Ctelehealth%2Ccarer-training%2Cearly-intervention&exp=disability%3Aintellectual%2Cdisability%3Aautism%2Cdisability%3Aphysical%2Cage%3Achildren%2Cage%3Ayoung-adults%2Csetting%3Ahome%2Csetting%3Acommunity%2Csetting%3Atelehealth&availDays=Mon%2CTue%2CWed%2CThu%2CFri&availFrom=8%3A00+AM&availTo=5%3A00+PM&susCom=visual-supports%2Csimple-language%2Cwritten-summaries&susCon=sensory-aware%2Cstrengths-based%2Cfamily-centred&susPre=calm%2Cplayful%2Cconsistent&yrsExp=7&customExp=Specialised+in+remote+service+delivery%2C+functional+capacity+assessments%2C+daily+living+skill+building%2C+sensory+processing%2C+assistive+technology+prescription%2C+and+supporting+participants+with+GDD+and+intellectual+disability+to+build+walking+endurance+and+independence.&badges=AHPRA+Registered%7CNDIS+Worker+Screening%7CBlue+Card%7CRemote+%26+Regional%7CTelehealth+Available&resources=NDIS%2520Occupational%2520Therapy%2520Explained%7Chttps%253A%252F%252Fwww.ndis.gov.au%252Fparticipants%252Freasonable-and-necessary-supports%252Ftherapies-and-supports%7COfficial%2520NDIS%2520guide%2520to%2520OT%2520supports%2520and%2520what%27s%2520funded%7EFlat%2520Feet%2520%2526%2520Orthotics%2520in%2520Children%7Chttps%253A%252F%252Fwww.rch.org.au%252Fkidsinfo%252Ffact_sheets%252FFlat_feet%252F%7CRoyal%2520Children%27s%2520Hospital%2520guide%2520for%2520families%7EBuilding%2520Walking%2520Endurance%2520%25E2%2580%2594%2520Tips%2520for%2520Families%7Chttps%253A%252F%252Fwww.cerebralpalsy.org.au%252Fresources%252F%7CPractical%2520strategies%2520to%2520support%2520walking%2520goals%2520at%2520home%7ESensory%2520Processing%2520%2526%2520Intellectual%2520Disability%7Chttps%253A%252F%252Fwww.otaus.com.au%252F%7COT%2520Australia%2520resources%2520for%2520practitioners%2520and%2520families";

function SarahOTRedirect() {
  useEffect(() => { window.location.replace(SARAH_OT_URL); }, []);
  return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "sans-serif", color: "#ccc" }}>Loading Sarah's profile…</div>;
}

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
      <Route path="/demo/sarah-ot">
        <SarahOTRedirect />
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
      <Route path="/allied-health" component={AlliedHealth} />
      <Route path="/contact" component={Contact} />
      <Route path="/guides" component={Guides} />
      <Route path="/directory" component={Directory} />
      <Route path="/ecosystem" component={Ecosystem} />
      <Route path="/about-me/editor" component={AboutMeEditor} />
      <Route path="/about-me/view" component={AboutMeView} />
      <Route path="/about-me">{() => { window.location.replace("/about-me/editor"); return null; }}</Route>
      <Route path="/about" component={About} />
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
  "/contact":     { href: "/",          label: "← Home" },
  "/guides":      { href: "/",          label: "← Home" },
  "/ecosystem":   { href: "/",          label: "← Home" },
  "/404":       { href: "/",          label: "← Home" },
};

function BackAwareBar() {
  const [location] = useLocation();
  // Landing page has its own full nav — hide the global TopAccessibilityBar there
  if (location === "/") return null;
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

  return (
    <TopAccessibilityBar
      showBack={!!backRoute}
      backHref={backRoute?.href}
      backLabel={backRoute?.label}
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
