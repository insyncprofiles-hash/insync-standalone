/* ============================================================
   How to Use — Comprehensive Buyer Guide
   Covers every feature of the InSync Profiles template
   with real-world advantages for support workers.
   Theme-aware: uses CSS variables for all colours.
   ============================================================ */
import { useState } from "react";
import { Link } from "wouter";
import { useColorTheme } from "@/contexts/ColorThemeContext";

// ── DATA ─────────────────────────────────────────────────────

const SECTIONS = [
  {
    id: "setup",
    icon: "🚀",
    title: "Getting Started",
    subtitle: "From purchase to live profile in under 10 minutes",
    steps: [
      {
        number: "01",
        icon: "🛒",
        title: "Purchase the Template",
        advantage: "Buy once. Use forever. No subscription.",
        detail: `After purchasing from the Pricing page, you'll receive a licence key to activate your profile editor. Enter it at YOUR_DOMAIN/editor and you're in — nothing to download, nothing to install. Works in any browser on any device.`,
        tip: "Keep your licence key somewhere safe. If you lose it, contact insyncprofiles@gmail.com and we'll help you out.",
        tags: ["One-time purchase", "No app needed", "Works on any device"],
      },
      {
        number: "02",
        icon: "🌐",
        title: "Open Your Template Link",
        advantage: "Works on iPhone, Android, iPad, Mac, and Windows.",
        detail: `Open your template link in Chrome, Safari, Firefox, or Edge. The template is a web app — it opens like a website but works like an app. On iPhone, tap Share → Add to Home Screen to save it as an icon on your phone for easy access.`,
        tip: "For the best editing experience on mobile, use Chrome or Safari in landscape (horizontal) orientation.",
        tags: ["Chrome ✓", "Safari ✓", "Firefox ✓", "Edge ✓"],
      },
    ],
  },
  {
    id: "profile",
    icon: "✏️",
    title: "Building Your Profile",
    subtitle: "Everything updates live as you type — no save button needed",
    steps: [
      {
        number: "03",
        icon: "👤",
        title: "Fill In Your Profile Details",
        advantage: "Live preview — see exactly what clients will see as you type.",
        detail: `Open the Edit Profile panel on the right side of the screen. In the Profile tab, fill in:\n\n• Full Name — appears on the post card and in the URL\n• Title — e.g. "Support Worker", "NDIS Support Worker", "Disability Support Specialist"\n• Tagline — your one-line statement (e.g. "I get it. I see you. I'm here.")\n• Bio — up to 280 characters. Write in your own voice.\n• Location — suburb and state (e.g. Brisbane, Queensland)\n• Email — your professional contact email\n• Website — your personal or professional website (optional)\n• Phone — optional, only add if you want clients to call directly\n• Availability — toggle the days you work and set your hours\n• Languages — add any languages you speak beyond English\n\nEvery field updates the post card preview instantly.`,
        tip: "Write your bio as if you're talking directly to a client or their family. Avoid jargon. Be specific about what you actually do.",
        tags: ["Live preview", "No save needed", "Up to 280 char bio"],
      },
      {
        number: "04",
        icon: "📸",
        title: "Upload Your Profile Photo",
        advantage: "Clients connect with people, not logos. A real photo builds trust instantly.",
        detail: `Click or tap the circular photo area in the centre of the post card. Select a photo from your device. The photo updates immediately in the preview.\n\nFor best results:\n• Use a recent, clear headshot\n• Face clearly visible, looking toward the camera\n• Good natural lighting (near a window works well)\n• Simple background — avoid busy patterns\n• Square or portrait orientation works best`,
        tip: "You don't need a professional photographer. A friend with a phone in good light is enough. Clients want to see the real you.",
        tags: ["Instant upload", "Any photo format", "Crops automatically"],
      },
      {
        number: "05",
        icon: "✅",
        title: "Select Your Services",
        advantage: "Show clients exactly what you offer — no guessing, no phone calls to find out.",
        detail: `Go to the Services tab in the editor panel. You'll see your active services at the top — toggle any on or off. Each service has:\n\n• An icon (emoji)\n• A label (e.g. "Personal Care")\n• A short description you can edit\n\nScroll down to "Add a Service from Catalogue" to see all 20 NDIS service categories. Tap any to add it to your profile. You can also add a completely custom service using "Add a Custom Service".\n\nThe post card shows your top 5 active services as visual bubbles. Clients see at a glance what you do.`,
        tip: "Be specific in your service descriptions. Instead of 'Personal Care', write 'Personal care including showering, dressing, and grooming — done with dignity and at your pace.'",
        tags: ["20 NDIS categories", "Custom services", "Editable descriptions"],
      },
      {
        number: "06",
        icon: "🏅",
        title: "Add Your Experience Areas",
        advantage: "Clients and coordinators search for workers with specific experience. This is how they find you.",
        detail: `Go to the Experience tab. You'll see experience grouped into categories:\n\n• Disability types (Autism, Cerebral Palsy, Down Syndrome, ABI, etc.)\n• Mental health (Anxiety, Depression, PTSD, Psychosocial disability, etc.)\n• Age groups (Children, Young adults, Older adults)\n• Communication (AAC users, Auslan, Non-verbal communication)\n• Behaviour support\n• Cultural backgrounds\n\nTick every area you have genuine experience with. These appear in your auto-generated caption as hashtags and keywords that support coordinators search for.`,
        tip: "Only tick areas you have real experience with. Clients and coordinators will ask about these in interviews — be ready to back them up with examples.",
        tags: ["Grouped by category", "Auto-adds to caption", "Searchable keywords"],
      },
      {
        number: "07",
        icon: "🏷️",
        title: "Add Your Professional Credentials (Self-Reported)",
        advantage: "Credentials shown visually on the post card build instant credibility.",
        detail: `In the Profile tab, scroll down to the Credentials section. Add badges for your certifications and checks:\n\n• NDIS Registered\n• First Aid Certified\n• Working With Children Check\n• Police Check\n• Manual Handling Certified\n• Medication Competency\n• Trauma-Informed Practice\n• Any other relevant qualification\n\nBadges appear as small tags at the bottom of your post card. Clients and coordinators look for these before making contact.`,
        tip: "Add up to 6 badges. Keep them short — 3–4 words maximum. These are the first things a support coordinator checks.",
        tags: ["Up to 6 badges", "Visible on post card", "Editable text"],
      },
      {
        number: "08",
        icon: "📹",
        title: "Record Your 15-Second Intro Video",
        advantage: "A 15-second video does more than a 500-word bio. Clients see your face, hear your voice, and decide if you're the right fit — before any awkward first meeting.",
        detail: `Scroll below the post card to the "Meet [Your Name]" video section. Click "Choose Video" to upload a video from your device.\n\nWhat to say in 15 seconds:\n1. Your name and where you're based\n2. One thing you genuinely love about support work\n3. One activity you enjoy doing with clients\n4. How to get in touch\n\nFilming tips:\n• Landscape (horizontal) orientation\n• Good natural light — face a window\n• Quiet background\n• Speak slowly and clearly\n• Smile — warmth matters`,
        tip: "Don't script it word for word. Speak naturally. Clients respond to authenticity, not perfection. One take is usually better than ten.",
        tags: ["15 seconds recommended", "Any video format", "Builds instant trust"],
      },
    ],
  },
  {
    id: "accessibility",
    icon: "🔧",
    title: "Accessibility Features",
    subtitle: "Why this is the most important section — for you and your clients",
    steps: [
      {
        number: "09",
        icon: "🌟",
        title: "The Gold Accessibility Button — What It Does",
        advantage: "This button is why InSync Profiles exists. It shows clients you thought about them before you even met.",
        detail: `The gold Accessibility button at the top of every page opens a panel with tools that make the template usable for people with a wide range of disabilities:\n\n• Text Size — Normal, Large (A+), Extra Large (A++)\n  For clients with low vision, cognitive disability, or anyone who finds small text hard to read\n\n• High Contrast Mode — increases colour contrast throughout the entire page\n  For clients with visual impairment, albinism, or light sensitivity\n\n• Dyslexia-Friendly Font — switches all text to Lexend, a font specifically designed to reduce reading difficulty\n  For clients with dyslexia, ADHD, or processing differences\n\n• Reduce Motion — disables all animations and transitions\n  For clients with vestibular disorders, epilepsy, or motion sensitivity\n\n• Read Page Aloud — reads the entire page content aloud using the device's text-to-speech\n  For clients with visual impairment, low literacy, or who prefer audio\n\nThese settings are saved between visits. A client who sets Large text on Monday will still have Large text when they return on Thursday.`,
        tip: "Tell clients about the Accessibility button in your caption or bio. Many clients with disability don't expect websites to accommodate them — pointing it out shows you get it.",
        tags: ["Text size control", "High contrast", "Dyslexia font", "Screen reader", "Reduce motion"],
      },
      {
        number: "10",
        icon: "🗣️",
        title: "AAC Communication Board",
        advantage: "For clients who use AAC (Augmentative and Alternative Communication) — this is the first time a support worker's profile has ever spoken their language.",
        detail: `Click the "AAC Board" button on the post card to open a full communication board. Clients can:\n\n• Tap any tile to hear it spoken aloud\n• Build sentences by tapping multiple tiles in sequence\n• Use the board to communicate interest, questions, or concerns without needing to type or speak\n\nThe board includes tiles for:\n• Greetings (Hello, Yes, No, Thank you)\n• Feelings (Happy, Nervous, Excited, Unsure)\n• Questions (Tell me more, How much?, When?)\n• Actions (I want to connect, Call me, Email me)\n\nFor clients who use AAC devices daily, seeing a support worker's profile with an AAC board is extraordinary. It signals: "I understand how you communicate. I'm ready for you."`,
        tip: "Mention the AAC board in your bio or caption: 'My profile includes an AAC communication board — tap any tile to speak.' This will stand out to every AAC user and their support network.",
        tags: ["Full AAC board", "Text-to-speech tiles", "Sentence builder", "Inclusive by design"],
      },
      {
        number: "11",
        icon: "🎨",
        title: "Colour Themes — 11 Options Including Light Backgrounds",
        advantage: "Different clients have different visual needs. Light backgrounds are easier for many people with cognitive disability, autism, or visual processing differences.",
        detail: `Click the Colour Theme button in the top bar to choose from 11 themes:\n\nDark themes (7):\n• Aurora — Northern Lights forest green & gold (default)\n• Midnight Gold — deep navy & warm gold\n• Forest & Sage — earthy green tones\n• Rose & Champagne — soft rose & warm cream\n• Ocean & Teal — deep ocean blue & bright teal\n• Plum & Lavender — rich plum & soft lavender\n• Charcoal & Coral — dark charcoal & warm coral\n\nLight themes (4):\n• Daylight — clean white & sky blue\n• Sage & Linen — warm linen & sage green\n• Blush & Cream — soft blush & warm cream\n• Slate & Mint — cool slate & fresh mint\n\nThe selected theme applies to the entire template — the post card, the editor, the sidebar, and all pages. Clients can also change the theme themselves using the same button.`,
        tip: "If you work primarily with clients who have cognitive disability, autism, or visual processing differences, consider setting a light theme as your default. Light backgrounds with dark text are generally easier to read.",
        tags: ["11 themes", "4 light options", "7 dark options", "Client can change too"],
      },
    ],
  },
  {
    id: "sharing",
    icon: "📲",
    title: "Sharing Your Profile",
    subtitle: "Get your profile in front of clients and coordinators",
    steps: [
      {
        number: "12",
        icon: "🔗",
        title: "Generate Your Shareable Profile Link",
        advantage: "One link. All your information. Works on any device. Clients tap it and see your full profile — no app, no login.",
        detail: `Once your profile is filled in, click the "🔗 Copy Shareable Link" button at the bottom of the post card (or the share icon in the action bar). A unique URL is copied to your clipboard.\n\nThis link contains all your profile data encoded in the URL. When someone opens it, they see your personalised profile with your name, photo, services, bio, and accessibility tools — all ready to go.\n\nShare this link:\n• In your Facebook bio\n• In your email signature\n• In messages to support coordinators\n• In NDIS Facebook groups\n• On LinkedIn\n• In your Mable or Hireup profile description`,
        tip: "Your link is long (it contains all your data). Use a free link shortener like bit.ly to make it shareable in text messages and printed materials.",
        tags: ["One-tap copy", "Works on any device", "No login for clients"],
      },
      {
        number: "13",
        icon: "📲",
        title: "Share Your Profile via QR Code",
        advantage: "One scan. Instant access. No typing, no searching — your full profile opens on any smartphone camera.",
        detail: `Your profile automatically generates a unique QR code. Find it in Thread 7 (Sharing) inside your editor.\n\nThe QR code encodes your full shareable profile link. Anyone who scans it with a smartphone camera is taken directly to your profile — no app needed, no login, no typing.\n\nWhere to use your QR code:\n\n📋 Resume & job applications — print it in the top corner of your CV so employers can scan and see your full profile instantly\n🪪 ID badge or lanyard card — clients scan when you arrive, before you've even said hello\n📱 WhatsApp & email signature — add it as an image so every message includes a tap-to-view profile link\n🖨 Printed flyers & brochures — hand out at community expos, disability events, and provider open days\n🏢 Provider noticeboards — post a printed card with your QR so coordinators can find you without a referral\n📲 Social media bio — Instagram, Facebook, LinkedIn: post the QR image so followers can scan it directly\n🎤 Presentations & info sessions — project your QR code so the whole room can scan at once\n🏷 Business cards — the most modern, accessible business card you can hand someone\n🏠 Home entry — some workers laminate their QR card and leave it with the client household so family members can always access the worker's profile\n📧 Email newsletters — embed the QR image in provider newsletters to introduce yourself to new participants`,
        tip: "Download your QR code as a PNG from the editor (Thread 7 → Download QR). Print it at A6 size for flyers, or paste it into a Word document to add to your CV.",
        tags: ["Instant scan", "No app needed", "Print-ready PNG", "Works offline"],
      },
      {
        number: "14",
        icon: "📋",
        title: "Copy Your Auto-Written Caption",
        advantage: "Your caption is already written. No blank page. No wondering what to say.",
        detail: `Go to the Caption tab in the editor panel. Your full social media caption is automatically generated from your profile details, including:\n\n• Your tagline\n• All your selected services with descriptions\n• Your experience areas\n• Your location and contact details\n• Relevant hashtags\n\nClick "Copy Caption" to copy it to your clipboard. Paste it directly into Facebook, LinkedIn, or any other platform.\n\nYou can edit the caption before posting — add a personal sentence about why you love your work to make it feel more authentic.`,
        tip: "Add one personal sentence to the top of the caption before posting. Something like: 'I've been a support worker for 7 years and I still get excited on the way to work.' Real stories get more engagement than professional descriptions.",
        tags: ["Auto-generated", "Includes hashtags", "Fully editable"],
      },
      {
        number: "15",
        icon: "📸",
        title: "Save Your Post Card as an Image",
        advantage: "The post card image is what stops people scrolling. It's designed to stand out in a feed.",
        detail: `To save the post card as an image for Instagram or Facebook:\n\n📱 iPhone/iPad: Press Side button + Volume Up at the same time. Screenshot saves to Photos.\n\n📱 Android: Press Power + Volume Down at the same time.\n\n💻 Mac: Press Cmd + Shift + 4, drag to select just the post card area.\n\n💻 Windows: Press Windows + Shift + S, drag to select the post card area.\n\nCrop the screenshot to show just the square post card for the cleanest result. Zoom in on the post card before screenshotting for a higher resolution image.`,
        tip: "On iPhone, you can also use the built-in Screen Recording feature to capture a video of yourself scrolling through your profile — this makes a great Instagram Story or Reel.",
        tags: ["iPhone ✓", "Android ✓", "Mac ✓", "Windows ✓"],
      },
      {
        number: "16",
        icon: "📱",
        title: "Post on Facebook",
        advantage: "Facebook is where NDIS participants, families, and support coordinators actively search for workers.",
        detail: `1. Open Facebook and tap 'What's on your mind?'\n2. Tap the photo icon and select your post card screenshot\n3. Paste your copied caption\n4. Set audience to Public\n5. Tap Post\n\nFor your Facebook bio: Edit Profile → Website → paste your shareable profile link.\n\nFor maximum reach, also share in:\n• Local NDIS Facebook groups\n• Disability support community groups in your area\n• Support coordinator groups (many accept worker introductions)\n\nPost at peak times: Tuesday–Friday, 9am–11am or 6pm–8pm AEST.`,
        tip: "Pin your profile post to the top of your Facebook profile. Anyone who visits your profile will see it first.",
        tags: ["Facebook Feed ✓", "Facebook Groups ✓", "Facebook Bio Link ✓"],
      },
      {
        number: "17",
        icon: "💼",
        title: "Share with Support Coordinators Directly",
        advantage: "Support coordinators match participants with workers. Getting on their radar directly is the fastest path to new clients.",
        detail: `Your shareable profile link is perfect for direct outreach to support coordinators:\n\nEmail template:\n"Hi [Name], I'm a support worker based in [suburb] with experience in [2–3 areas]. I've put together an accessible profile that gives you everything you need to know about how I work: [your link]. Happy to chat if you have participants who might be a good fit."\n\nThe profile link shows coordinators:\n• Your services and experience at a glance\n• Your credentials and checks\n• Your availability\n• Your accessibility features (which coordinators notice)\n• How to contact you\n\nThis is significantly more professional than a plain text email or a PDF resume.`,
        tip: "Follow up once after sending. A short message 5–7 days later: 'Just checking in — happy to answer any questions about my profile.' Most coordinators appreciate the follow-through.",
        tags: ["Email-ready", "More professional than a resume", "Coordinators notice accessibility"],
      },
    ],
  },
  {
    id: "maintenance",
    icon: "🔄",
    title: "Keeping Your Profile Current",
    subtitle: "Your profile is a living document — update it as you grow",
    steps: [
      {
        number: "18",
        icon: "🔄",
        title: "Updating Your Profile",
        advantage: "No limit on updates. Your profile grows with your career.",
        detail: `Your template is always editable. Open your template link, make your changes, and generate a new shareable profile link. Share the new link wherever you've shared the old one.\n\nUpdate your profile when:\n• You gain a new certification or qualification\n• You add a new service\n• You change your availability\n• You get a new professional photo\n• You move to a new area\n• You want to highlight new experience\n\nThere is no limit to how many times you can update your profile.`,
        tip: "Set a calendar reminder every 3 months to review your profile. Add any new experience, update your photo if it's more than a year old, and check that your availability is still accurate.",
        tags: ["Unlimited updates", "Instant changes", "No re-purchase needed"],
      },
      {
        number: "19",
        icon: "💡",
        title: "Why This Template Makes You Stand Out",
        advantage: "In a sector where most workers have no digital presence, an accessible, professional profile is a significant competitive advantage.",
        detail: `Most support workers in Australia have no online profile beyond a brief listing on Mable or Hireup. InSync Profiles gives you:\n\n1. A professional first impression — before any conversation happens\n2. Accessibility built in — showing clients you've thought about their needs\n3. An AAC board — the first support worker profile to include one\n4. A shareable link — works in emails, messages, bio links, and social media\n5. An auto-written caption — no blank page when posting\n6. A 15-second video — clients see your face and hear your voice before meeting you\n7. Credentials displayed visually — not buried in a PDF\n8. Availability shown clearly — clients know when you're free before calling\n9. Multiple contact options — email, phone, website\n10. 11 colour themes — clients can customise the display for their visual needs\n\nSupport coordinators and clients notice when a worker has invested in their professional presentation. It signals reliability, professionalism, and genuine commitment to the work.`,
        tip: "When sharing your profile, add a line like: 'My profile includes accessibility tools for text size, contrast, dyslexia font, and an AAC board.' This one sentence will make you memorable to every coordinator who reads it.",
        tags: ["Professional presence", "Accessibility signal", "Competitive advantage"],
      },
    ],
  },
];

// ── COMPONENT ────────────────────────────────────────────────

export default function HowToUse() {
  useColorTheme(); // keep theme context alive for nav bar
  const [expandedStep, setExpandedStep] = useState<string | null>("01");
  const [activeSection, setActiveSection] = useState("setup");

  // How It Works is always light — it's a buyer guide, not a themed product page
  const accent     = "#2563eb";   // solid blue accent
  const pageBg     = "#f4f7fb";
  const solidCard  = "#ffffff";
  const solidCard2 = "#eef3fb";
  const headText   = "#0d1b2a";
  const bodyText   = "#2a3a4a";
  const dimText    = "#4a6080";

  return (
    <div
      className="min-h-screen"
      style={{
        background: pageBg,
        color: headText,
        paddingTop: "110px", // 60px top bar + 50px access bar
      }}
    >

      {/* Hero */}
      <div
        className="text-center py-14 px-6"
        style={{ borderBottom: `1px solid ${accent}30`, background: "#eaf2fc" }}
      >
        <p className="text-xs tracking-widest uppercase mb-3" style={{ color: accent, fontFamily: "'Outfit', sans-serif" }}>
          Complete Guide
        </p>
        <h1
          className="text-4xl md:text-5xl font-bold mb-4"
          style={{ fontFamily: "'Cormorant Garamond', serif", color: headText }}
        >
          How to Use InSync Profiles
        </h1>
        <p className="text-base max-w-2xl mx-auto mb-8" style={{ color: bodyText, fontFamily: "'Outfit', sans-serif", lineHeight: 1.6 }}>
          Every feature explained. Every advantage shown. From first open to first client — a complete guide for support workers.
        </p>

        {/* Quick stats */}
        <div className="flex flex-wrap justify-center gap-8">
          {[
            { value: "20", label: "Steps covered" },
            { value: "~10", label: "Minutes to set up" },
            { value: "11", label: "Colour themes" },
            { value: "0", label: "App downloads" },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif", color: accent }}>{stat.value}</p>
              <p className="text-xs mt-1" style={{ color: dimText, fontFamily: "'Outfit', sans-serif" }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Section nav */}
      <div
        className="sticky top-[110px] z-40 flex overflow-x-auto gap-2 px-4 py-3"
        style={{
          background: "#ffffff",
          borderBottom: `1px solid ${accent}30`,
          scrollbarWidth: "none",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Home button */}
        <Link
          href="/"
          style={{
            flexShrink: 0,
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            padding: "6px 14px",
            borderRadius: "99px",
            border: `1.5px solid ${accent}40`,
            background: `${accent}10`,
            color: accent,
            fontFamily: "'Outfit', sans-serif",
            fontSize: "12px",
            fontWeight: 700,
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
          aria-label="Back to home page"
        >
          ← Home
        </Link>
        {/* Divider */}
        <span style={{ width: "1px", background: `${accent}25`, flexShrink: 0, alignSelf: "stretch", margin: "4px 2px" }} />
        {SECTIONS.map(section => (
          <button
            key={section.id}
            onClick={() => {
              setActiveSection(section.id);
              document.getElementById(`section-${section.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            style={{
              flexShrink: 0,
              padding: "6px 14px",
              borderRadius: "99px",
              border: `1.5px solid ${activeSection === section.id ? accent : `${accent}30`}`,
              background: activeSection === section.id ? `${accent}18` : "transparent",
              color: activeSection === section.id ? accent : dimText,
              fontFamily: "'Outfit', sans-serif",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 150ms ease-out",
              whiteSpace: "nowrap",
            }}
          >
            {section.icon} {section.title}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-16">
        {SECTIONS.map(section => (
          <div key={section.id} id={`section-${section.id}`}>
            {/* Section header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <span style={{ fontSize: "28px" }}>{section.icon}</span>
                <h2
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "28px",
                    fontWeight: 700,
                    color: headText,
                    margin: 0,
                  }}
                >
                  {section.title}
                </h2>
              </div>
              <p style={{ color: dimText, fontFamily: "'Outfit', sans-serif", fontSize: "14px", margin: 0 }}>
                {section.subtitle}
              </p>
              <div style={{ height: "2px", background: `linear-gradient(90deg, ${accent}60, transparent)`, marginTop: "12px", borderRadius: "1px" }} />
            </div>

            {/* Steps */}
            <div className="space-y-3">
              {section.steps.map(step => {
                const key = `${section.id}-${step.number}`;
                const isOpen = expandedStep === key;
                return (
                  <div
                    key={key}
                    className="rounded-2xl overflow-hidden"
                    style={{
                      background: isOpen ? solidCard : solidCard2,
                      border: `1.5px solid ${isOpen ? `${accent}60` : `${accent}25`}`,
                      transition: "all 200ms ease-out",
                    }}
                  >
                    {/* Step header */}
                    <button
                      onClick={() => setExpandedStep(isOpen ? null : key)}
                      className="w-full flex items-center gap-4 p-4 text-left"
                      style={{ background: "none", border: "none", cursor: "pointer" }}
                      aria-expanded={isOpen}
                    >
                      <span
                        className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                        style={{
                          background: isOpen ? accent : `${accent}20`,
                          color: isOpen ? "#ffffff" : accent,
                          fontFamily: "'Outfit', sans-serif",
                          fontSize: "13px",
                          fontWeight: 700,
                          transition: "all 200ms ease-out",
                        }}
                      >
                        {isOpen ? step.icon : step.number}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p
                          className="font-semibold text-sm"
                          style={{ color: headText, fontFamily: "'Outfit', sans-serif", margin: 0 }}
                        >
                          {step.title}
                        </p>
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: isOpen ? accent : dimText, fontFamily: "'Outfit', sans-serif", margin: 0 }}
                        >
                          {step.advantage}
                        </p>
                      </div>
                      <span
                        style={{
                          color: dimText,
                          fontSize: "14px",
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 200ms ease-out",
                          flexShrink: 0,
                        }}
                        aria-hidden="true"
                      >
                        ▾
                      </span>
                    </button>

                    {/* Expanded content */}
                    {isOpen && (
                      <div className="px-4 pb-5">
                        {/* Detail text */}
                        <div
                          style={{
                            color: bodyText,
                            fontFamily: "'Outfit', sans-serif",
                            fontSize: "14px",
                            lineHeight: 1.7,
                            whiteSpace: "pre-line",
                            marginBottom: "16px",
                          }}
                        >
                          {step.detail}
                        </div>

                        {/* Tags */}
                        {step.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {step.tags.map(tag => (
                              <span
                                key={tag}
                                style={{
                                  padding: "3px 10px",
                                  borderRadius: "99px",
                                  background: `${accent}15`,
                                  border: `1px solid ${accent}35`,
                                  color: accent,
                                  fontFamily: "'Outfit', sans-serif",
                                  fontSize: "11px",
                                  fontWeight: 600,
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Tip */}
                        <div
                          style={{
                            background: `${accent}12`,
                            border: `1px solid ${accent}40`,
                            borderRadius: "10px",
                            padding: "12px 14px",
                            display: "flex",
                            gap: "10px",
                            alignItems: "flex-start",
                          }}
                        >
                          <span style={{ fontSize: "16px", flexShrink: 0, lineHeight: 1.4 }}>💡</span>
                          <p
                            style={{
                              color: bodyText,
                              fontFamily: "'Outfit', sans-serif",
                              fontSize: "13px",
                              lineHeight: 1.6,
                              margin: 0,
                            }}
                          >
                            <strong style={{ color: accent }}>Pro tip:</strong> {step.tip}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Footer CTA */}
        <div
          className="text-center py-12 rounded-3xl"
          style={{
            background: solidCard,
            border: `1.5px solid ${accent}35`,
          }}
        >
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "32px", fontWeight: 700, color: headText, margin: "0 0 8px" }}>
            Ready to stand out?
          </p>
          <p style={{ color: dimText, fontFamily: "'Outfit', sans-serif", fontSize: "14px", margin: "0 0 24px" }}>
            Your profile is waiting. It takes less than 10 minutes to set up.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/pricing"
              style={{
                background: "transparent",
                color: accent,
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 600,
                fontSize: "14px",
                padding: "12px 28px",
                borderRadius: "99px",
                textDecoration: "none",
                border: `1.5px solid ${accent}50`,
                display: "inline-block",
              }}
            >
              View Pricing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
