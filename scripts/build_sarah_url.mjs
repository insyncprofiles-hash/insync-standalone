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
params.set("bio", "Hi, I'm Sarah — an OT based in Queensland with a special interest in working with children and young people with intellectual and developmental disabilities.\n\nI believe the best therapy happens when the person in front of me is actually part of it. That means starting with what they love, what lights them up, and what matters to their family — not a checklist.\n\nAs an OT, I work on the things that matter in everyday life — building independence in daily living tasks, assessing functional capacity, recommending assistive technology, supporting sensory regulation, and helping participants and their families develop strategies they can use between sessions. I also work closely with schools, carers, and support teams to make sure the plan carries through everywhere it needs to.\n\nI work across remote and regional Queensland and I'm experienced in supporting participants with global developmental delay, low muscle tone, and building walking endurance through fun, meaningful activity.\n\nBefore I travel to your town, I'd love to hear from Ky and the family. If Ky wants to let me know anything — what he's excited about, what he's worried about, or just say hi — he can use the Speak to Message button or the AAC board on this page. No typing needed.\n\nI'm registered with AHPRA and a member of Occupational Therapy Australia. I hold a current NDIS Worker Screening Check, Blue Card, and full professional indemnity insurance.");

// Contact
params.set("email", "sarah.torens@example.com.au");
params.set("phone", "0400 000 000");
params.set("location", "Queensland (Remote & Regional)");
params.set("ctaText", "MESSAGE TO BEGIN");

// Video — YouTube Shorts
params.set("video", "https://youtube.com/shorts/_e1uvuez1NI?si=jGkN2eZw0Zxkdj9z");

// Photo — using the generated courtyard image (uploaded to CDN)
params.set("photo", "https://insyncprofiles.net/manus-storage/sarah_torens_real_bbb59a2c.jpg");

// Services
// OT-specific services (from ALLIED_HEALTH_SERVICES)
params.set('services', 'ot,sensory-processing,assistive-tech,capacity-building,home-visits,telehealth,carer-training,early-intervention');

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
params.set("customExp", "Specialised in remote service delivery, functional capacity assessments, daily living skill building, sensory processing, assistive technology prescription, and supporting participants with GDD and intellectual disability to build walking endurance and independence.");

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
