// Build Sarah Torens' OT demo profile URL
// Run: node scripts/build_sarah_url.mjs

const BASE = "https://insyncprofiles.net";

const params = new URLSearchParams();

// Identity
params.set("name", "Sarah Torens");
params.set("title", "Occupational Therapist");
params.set("tagline", "I meet you where you are — and we go from there.");
params.set("roleType", "allied-health");

// Bio
params.set("bio", "Hi, I'm Sarah — an OT based in Queensland with a special interest in working with children and young people with intellectual and developmental disabilities.\n\nI believe the best therapy happens when the person in front of me is actually part of it. That means starting with what they love, what lights them up, and what matters to their family — not a checklist.\n\nI work across remote and regional Queensland, and I'm experienced in supporting participants with flat feet, low muscle tone, and building walking endurance through fun, meaningful activity. I use sensory-based approaches and love finding creative ways to make movement feel like play.\n\nI'm registered with AHPRA and a member of Occupational Therapy Australia. I hold a current NDIS Worker Screening Check, Blue Card, and full professional indemnity insurance.");

// Contact
params.set("email", "sarah.torens@example.com.au");
params.set("phone", "0400 000 000");
params.set("location", "Queensland (Remote & Regional)");
params.set("ctaText", "MESSAGE TO BEGIN");

// Video — YouTube Shorts
params.set("video", "https://youtube.com/shorts/_e1uvuez1NI?si=jGkN2eZw0Zxkdj9z");

// Photo — using the generated courtyard image (uploaded to CDN)
params.set("photo", "https://d2xsxph8kpxj0f.cloudfront.net/310519663667622901/SgcmZj9RW7LdYQCSs9WS8N/sarah_profile_A-5KtEQXy8KQjwy4BSo2dDgq.png");

// Services
params.set("services", "therapy-assist,community-access,daily-living,transport");

// Experience / specialties
params.set("exp", [
  "disability:intellectual",
  "disability:autism",
  "disability:physical",
  "age:children",
  "age:young-adults",
  "setting:home",
  "setting:community",
  "setting:telehealth",
].join(","));

// Availability
params.set("availDays", "Mon,Tue,Wed,Thu,Fri");
params.set("availFrom", "8:00 AM");
params.set("availTo", "5:00 PM");

// How I Show Up
params.set("susCom", "visual-supports,simple-language,written-summaries");
params.set("susCon", "sensory-aware,strengths-based,family-centred");
params.set("susPre", "calm,playful,consistent");

// Years experience
params.set("yrsExp", "7");

// Custom experience note
params.set("customExp", "Specialised in remote service delivery, flat feet & orthotics, walking endurance programs, sensory processing, and AAC-friendly communication approaches.");

// Badges
params.set("badges", [
  "AHPRA Registered",
  "NDIS Worker Screening",
  "Blue Card",
  "Remote & Regional",
  "Telehealth Available",
].join("|"));

// Resources
const resources = [
  { title: "NDIS Occupational Therapy Explained", url: "https://www.ndis.gov.au/participants/reasonable-and-necessary-supports/therapies-and-supports", description: "Official NDIS guide to OT supports and what's funded" },
  { title: "Flat Feet & Orthotics in Children", url: "https://www.rch.org.au/kidsinfo/fact_sheets/Flat_feet/", description: "Royal Children's Hospital guide for families" },
  { title: "Building Walking Endurance — Tips for Families", url: "https://www.cerebralpalsy.org.au/resources/", description: "Practical strategies to support walking goals at home" },
  { title: "Sensory Processing & Intellectual Disability", url: "https://www.otaus.com.au/", description: "OT Australia resources for practitioners and families" },
];
const resParts = resources.map(r =>
  `${encodeURIComponent(r.title)}|${encodeURIComponent(r.url)}|${encodeURIComponent(r.description)}`
);
params.set("resources", resParts.join("~"));

const fullUrl = `${BASE}/view?${params.toString()}`;
console.log("\n=== SARAH TORENS OT DEMO PROFILE URL ===\n");
console.log(fullUrl);
console.log("\n=== URL LENGTH ===");
console.log(fullUrl.length, "characters");
