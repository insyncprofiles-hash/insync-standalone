/* ============================================================
   BlogPost.tsx — InSync Profiles Individual Blog Article Page
   Design: Matches Landing page — deep navy bg, gold accents
   Fonts: Cormorant Garamond (display) + Outfit (body)
   ============================================================ */
import React, { useEffect } from "react";
import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";

const C = {
  bgPage:    "linear-gradient(160deg, #0d1b2a 0%, #0f2d3d 40%, #0a2a1e 100%)",
  bgCard:    "rgba(255,255,255,0.06)",
  textHead:  "#ffffff",
  textBody:  "rgba(255,255,255,0.82)",
  textDim:   "rgba(255,255,255,0.45)",
  gold:      "#f5c842",
  teal:      "#2dd4bf",
  border:    "rgba(255,255,255,0.10)",
  borderGold:"rgba(245,200,66,0.30)",
};

// ── The article content ─────────────────────────────────────
function SeaOfSamenessArticle() {
  return (
    <>
      <p>
        Open any Facebook Group, LinkedIn feed, or local community board today, and you will see the exact same thing. Hundreds of support worker posts reading from the exact same script:
      </p>
      <blockquote>
        <p>"Hi, I'm an independent support worker with spots available!"</p>
        <p>"I love cooking, community access, and walks in the park."</p>
        <p>"I have a reliable car, ABN, and my First Aid certificate. DM me!"</p>
      </blockquote>
      <p>
        While these qualifications are fantastic, this repetitive way of posting creates a massive problem in the Australian care sector: a <strong>sea of sameness</strong>.
      </p>
      <p>
        When every post looks, sounds, and reads identically, true compatibility becomes impossible to find. People with disability and their families are forced to guess who will actually fit into their lives. Exceptional support workers remain completely invisible, hidden behind generic text updates and algorithms that treat human connection like a classified ad.
      </p>
      <p>
        At InSync Profiles, we believe the support sector deserves better. Here is why relying on basic social media posts is failing workers, participants, and families alike — and how an accessibility and interaction approach is changing the game.
      </p>

      <h2>The Real-World Problem: The Cost of Invisibility on Social Media</h2>
      <p>
        For independent support workers, posting the same generic text as everyone else is bad for business. When you cannot easily showcase your unique skills, lived experience, or personality, you become a commodity. Clients end up choosing support based on price alone, rather than value and fit.
      </p>
      <p>
        For families and NDIS participants, scrolling through endless, identical Facebook posts is exhausting. Inviting a stranger into your home based on a three-sentence social media update is a massive gamble. It leads to high turnover, broken trust, and wasted funding.
      </p>
      <p>
        <strong>The care sector doesn't need more generic text posts. It needs human visibility.</strong>
      </p>

      <h2>Introducing InSync Profiles: The New Standard for Support Professionals</h2>
      <p>
        InSync Profiles eliminates the guesswork by transforming a basic, lifeless social media post into a dynamic, multi-dimensional Digital Support Worker Profile.
      </p>
      <p>
        Instead of dropping a wall of text into a Facebook group, workers can drop a single link that showcases human personality, communication style, and real-world capability. An InSync Profiles profile brings a worker's true identity to light before they ever step through a client's front door.
      </p>

      <h2>🌟 Key Unique Features Built for the Modern Sector</h2>
      <ul>
        <li><strong>True-Identity Multimedia:</strong> Workers can upload video introductions, audio clips, and personalized portfolios so families can instantly gauge energy, tone, and cultural fit from a single link.</li>
        <li><strong>Invisible Skill Mapping:</strong> We highlight the soft skills, sensory sensitivities, specific lived experiences, and compatibility triggers that standard text posts completely ignore.</li>
        <li><strong>Third-Party Professional Integrations:</strong> Workers can neatly aggregate all of their external, third-party professional links in one centralized hub, allowing clients to click through and handle direct verification seamlessly.</li>
        <li><strong>The Hyper-Visibility Engine:</strong> A premium, professional digital link that independent workers fully own, manage, and can paste directly into any social media platform, provider directory, or email.</li>
      </ul>

      <h2>🤝 How the Entire NDIS Eco-System Benefits</h2>

      <h3>🧑‍🦽 For People with Disability: Choice and Control</h3>
      <p>
        You should have the autonomy to see and hear your potential support team beforehand. InSync Profiles helps you find someone who truly shares your interests, respects your boundaries, and matches your lifestyle — with easy access to the worker's third-party professional links for direct verification.
      </p>

      <h3>🏡 For Families &amp; Carers: Peace of Mind, Faster</h3>
      <p>
        Drastically reduce the time spent filtering through random social media comments. By reviewing a rich, transparent digital CV link, you can confidently shortlist support workers who will seamlessly integrate into your family's routine.
      </p>

      <h3>💼 For Support Workers: Stand Out and Earn Your Worth</h3>
      <p>
        Stop fighting the algorithms of noisy social media feeds. InSync Profiles gives you a professional digital asset to justify your hourly rates, showcase your professionalism, and win private clients by letting you display your third-party professional networks proudly.
      </p>

      <h2>Stop Being Invisible. Get InSync.</h2>
      <p>
        The support sector is built on human connection, so why are we still hiring based on flat text posts? Whether you are a worker looking to grow your independent business, or a family searching for the perfect care match, it is time to step out of the sea of sameness.
      </p>
      <p>
        <strong>👉 Ready to transform how you present yourself online?</strong> Create your unique profile today at <a href="https://insyncprofiles.net" style={{ color: "#f5c842" }}>insyncprofiles.net</a>.
      </p>

      <div style={{ marginTop: "48px", padding: "28px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px" }}>
        <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "16px" }}>Related Topics</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {[
            "How to get private NDIS clients on Facebook",
            "Why am I not getting clients from Facebook groups NDIS",
            "Support worker Facebook posts not working",
            "NDIS independent support worker find clients fast",
            "How to stand out in support worker Facebook groups",
            "Getting lost in NDIS Facebook groups",
            "Independent support worker bio examples Australia",
            "Free digital portfolio tool for NDIS workers",
            "Support worker template sounds too generic",
            "How to write a support worker introduction post",
            "Alternative to standard resumes for support workers",
            "Best digital CV platforms for NDIS independent workers",
            "How to justify higher independent support worker rates",
            "NDIS support platforms with high fees alternative",
            "How to build a private support worker brand Australia",
            "Stop fighting agency algorithms support worker",
          ].map(tag => (
            <span key={tag} style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "99px", padding: "4px 12px", lineHeight: 1.5 }}>{tag}</span>
          ))}
        </div>
      </div>
    </>
  );
}

// ── Lanyard Card Benefits Article ──────────────────────────
function LanyardCardBenefitsArticle() {
  return (
    <>
      <div style={{ textAlign: "center", margin: "0 0 40px" }}>
        <img
          src="/assets/lanyard_card_v2.png"
          alt="InSync Profiles lanyard card — matt black with diagonal aurora strip and QR code"
          style={{ maxWidth: "320px", width: "100%", borderRadius: "20px", boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(212,160,23,0.15)" }}
        />
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", marginTop: "12px", fontStyle: "italic" }}>The InSync Profiles lanyard card — each buyer receives a card with their own unique QR code</p>
      </div>

      <p>
        A matt black card. A diagonal aurora strip flowing from deep purple to warm gold. A QR code sitting right in the centre. Two words at the bottom: <strong style={{ color: "#f5c842" }}>SUPPORT WORKER</strong>.
      </p>
      <p>
        That is all it takes. Support workers wearing the InSync Profiles lanyard card are discovering that the most powerful marketing tool they own is not a Facebook post, not a business card, and not a listing on a platform — it is the thing hanging around their neck.
      </p>

      <h2>In the Local Community</h2>
      <p>
        Support workers are out in the community every day — at supermarkets, parks, cafes, transport hubs, and community centres. The lanyard card turns every outing into a passive marketing moment. When a carer, coordinator, or family member notices <em>"SCAN ME. SUPPORT WORKER"</em> on a lanyard, curiosity does the work. A quick scan delivers a full, polished profile instantly — no business card needed, no fumbling for contact details.
      </p>
      <p>
        The design is intentional. The aurora strip catches the eye. The matt black commands attention without being loud. People notice it and ask about it before the worker has said a single word.
      </p>

      <h2>On Personal Errands</h2>
      <p>
        Even off-duty, a support worker running errands is visible in their community. NDIS participants, family members, and support coordinators are everywhere. A professional, eye-catching lanyard card signals credibility and approachability. It opens conversations that would never happen otherwise — someone in a checkout queue, a neighbour, or a local business owner who knows a family looking for support.
      </p>
      <p>
        The card does not require the worker to introduce themselves, pitch their services, or hand over a number. The QR code handles all of that. One scan and the potential client is already reading the worker's profile, watching their intro video, and reviewing their qualifications.
      </p>

      <h2>At Community Events, Markets &amp; Expos</h2>
      <p>
        Events like disability expos, community markets, NDIS information days, and local fairs are high-value environments. A worker wearing their InSync Profile lanyard card stands out immediately. Coordinators and participants actively looking for workers can scan and shortlist on the spot — no forms, no follow-up emails required.
      </p>
      <p>
        In a room full of people handing out paper flyers, a scannable card that links directly to a rich, interactive profile is a completely different category of professional presence.
      </p>

      <h2>Attracting New Informed Clients</h2>
      <p>
        This is perhaps the most powerful benefit. When a potential client or coordinator scans the QR code, they do not just get a name and phone number. They receive a complete picture:
      </p>
      <ul>
        <li><strong>A photo and introduction video</strong> — immediate personal connection before any conversation</li>
        <li><strong>Qualifications and certifications</strong> — instant trust and credibility verification</li>
        <li><strong>Communication style and personality</strong> — helps clients assess compatibility upfront</li>
        <li><strong>AAC board and accessibility features</strong> — shows the worker understands diverse needs</li>
        <li><strong>Location and availability</strong> — reduces back-and-forth enquiries</li>
        <li><strong>Direct contact or booking link</strong> — frictionless path from interest to engagement</li>
      </ul>
      <p>
        The result is that every client who reaches out via the QR code is already informed, already interested, and already aligned. Conversion rates improve dramatically because the discovery process has already happened — before the first phone call.
      </p>

      <h2>Building a Personal Brand Over Time</h2>
      <p>
        A support worker who consistently wears their lanyard card builds name recognition in their local area. Over months and years, this compounds. Coordinators remember them. Clients refer them. The worker becomes a known, trusted presence in their community rather than an anonymous entry in a database.
      </p>
      <p>
        The InSync Profiles lanyard card is not just an accessory. It is a statement of professional identity — one that works quietly, consistently, and without any ongoing effort from the worker.
      </p>

      <blockquote>
        <p>Your profile goes where you go. Every errand. Every outing. Every event. The QR code is always ready. The conversation can start any time.</p>
      </blockquote>

      <p>
        <strong>Ready to get yours?</strong> Every InSync Profiles licence includes a downloadable lanyard card with your unique QR code, ready to print and wear. <a href="/pricing" style={{ color: "#f5c842" }}>View pricing →</a>
      </p>

      <div style={{ marginTop: "48px", padding: "28px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px" }}>
        <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "16px" }}>Related Topics</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {[
            "NDIS support worker marketing ideas",
            "How to attract private NDIS clients",
            "Support worker personal brand Australia",
            "QR code lanyard for support workers",
            "NDIS independent worker tips",
            "How to get more NDIS clients without social media",
            "Support worker business card alternative",
            "Digital profile for NDIS workers",
            "Passive marketing for support workers",
            "NDIS worker community visibility",
          ].map(tag => (
            <span key={tag} style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "99px", padding: "4px 12px", lineHeight: 1.5 }}>{tag}</span>
          ))}
        </div>
      </div>
    </>
  );
}

// ── "Who is going to support me?" Article ─────────────────────
function WhoIsGoingToSupportMeArticle() {
  return (
    <>
      <p>
        Most people asking this question already know the answer they are going to get. A name. Maybe a gender. A time slot. That is usually it.
      </p>
      <p>
        Someone they have never met is going to walk through their front door and help them with some of the most personal parts of their day — and the information they had to make that decision fits in a text message.
      </p>
      <p>
        The NDIS is built on choice and control. That is not just a slogan, it is in the legislation. But choice without information is not really choice. It is just a guess with paperwork behind it.
      </p>

      <h2>The gap has been there a long time</h2>

      <div style={{ margin: "32px 0", borderRadius: "16px", overflow: "hidden" }}>
        <img
          src="/assets/informed_choice_gap_real.jpg"
          alt="The Gap Is Real — InSync Profiles infographic showing 2023 NDIS Review findings and 2026 participant voice on informed choice"
          style={{ width: "100%", display: "block", borderRadius: "16px" }}
        />
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", marginTop: "10px", fontStyle: "italic", textAlign: "center" }}>
          Source: NDIS Review — What We Have Heard Report (June 2023) · NDIA Supported Decision Making Advisory Group Feedback (February 2026)
        </p>
      </div>

      <p>
        The 2023 NDIS Review put it plainly — participants and their families do not have what they need to find providers, compare what they are offering, or make an informed decision about what will work best for them.
      </p>
      <p>
        That was three years ago. The NDIA's own Supported Decision Making Advisory Group was still hearing the same thing in early 2026. Participants wanting better information so they could actually understand their options and use them.
      </p>
      <p>
        The right to choose has been there. The information needed to choose has not.
      </p>

      <h2>What actually matters when you are choosing someone</h2>

      <div style={{ margin: "32px 0", borderRadius: "16px", overflow: "hidden" }}>
        <img
          src="/assets/informed_choice_comparison.jpg"
          alt="Which side supports informed choice? Comparison of limited information (name, gender, availability) versus rich information (communication style, interests, experience, personality, video introduction)"
          style={{ width: "100%", display: "block", borderRadius: "16px" }}
        />
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", marginTop: "10px", fontStyle: "italic", textAlign: "center" }}>
          Limited information leads to high uncertainty. More information leads to stronger choice.
        </p>
      </div>

      <p>
        A name tells you nothing. A gender tells you nothing. An availability window tells you when they can show up — not whether you actually want them to.
      </p>
      <p>
        What people want to know before they say yes to a support worker is the same stuff anyone would want to know before letting someone into their home regularly. How do they communicate. What do they actually understand about the kind of support you need. What are they like as a person. Do they get it, or are they just doing a job.
      </p>
      <ul>
        <li><strong>Communication style</strong> — how the worker communicates, and whether that matches the participant's preferences</li>
        <li><strong>Interests and personality</strong> — the human dimension that shapes whether support becomes a genuine relationship or just a transaction</li>
        <li><strong>Experience areas</strong> — specific conditions, environments, and support types the worker has genuine experience with</li>
        <li><strong>Approach to support</strong> — their values and how they show up in practice</li>
        <li><strong>A video introduction</strong> — because a face and a voice carry information that text never can</li>
      </ul>
      <p>
        None of this is complicated. It just has not existed in a standard, shareable form until now.
      </p>

      <h2>What the 2026 reforms are pointing toward</h2>

      <div style={{ margin: "32px 0", borderRadius: "16px", overflow: "hidden" }}>
        <img
          src="/assets/informed_choice_provider_banner.jpg"
          alt="Can you show how your participants choose their support worker? InSync Profiles helps providers turn 2026 reform principles into practice — supported decision making, participant engagement, transparency and choice."
          style={{ width: "100%", display: "block", borderRadius: "16px" }}
        />
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", marginTop: "10px", fontStyle: "italic", textAlign: "center" }}>
          2026 reforms are increasing expectations around participant engagement, supported decision-making, transparency and choice.
        </p>
      </div>

      <p>
        The NDIS Future Generations Bill 2026 is restructuring how intermediary services work. The overall direction is fewer layers between participants and their supports, and more genuine involvement from participants in choosing who works with them.
      </p>
      <p>
        For providers, the question of how participants are choosing their workers is moving from a nice-to-have to something they are going to need to demonstrate. Supported decision-making and participant engagement are named reform outcomes, not just principles.
      </p>
      <p>
        A name on a roster does not answer that question. A profile that includes a video, a communication style, experience areas, and a clear sense of who the worker is — that gives a participant something they can actually use.
      </p>

      <h2>What this means in practice</h2>
      <p>
        For <strong>participants and families</strong> — the reforms are reinforcing something that was always true. You have the right to know who is coming. More workers are building profiles that answer that question directly, which makes the whole process less of a guess.
      </p>
      <p>
        For <strong>support workers</strong> — a profile that shows who you actually are tends to attract participants who already fit how you work. That is better for everyone. Less friction, better relationships, fewer situations where the match was wrong from the start.
      </p>
      <p>
        For <strong>coordinators and providers</strong> — having workers with real, shareable profiles makes your job easier and puts you ahead of where the sector is heading. Participants can review workers before a match is proposed. That is what engagement is supposed to look like.
      </p>

      <p>
        The question <em>"Who is going to support me?"</em> deserves a real answer. Not a name on a list. A person. A profile. Something a participant can actually read and decide from.
      </p>

      <p>
        <a href="/view" style={{ color: "#f5c842" }}>See what a participant sees when choosing their support worker →</a>
      </p>

      <div style={{ marginTop: "48px", padding: "28px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px" }}>
        <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "16px" }}>Related Topics</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {[
            "#NDISInformedChoice",
            "#ChoiceAndControl",
            "#Inclusion",
            "#DisabilityInclusion",
            "#SupportedDecisionMaking",
            "#NDISParticipantRights",
            "#NDIS2026Reforms",
            "#SupportWorker",
            "#NDISParticipant",
            "#InclusiveSupport",
            "#NDISFutureGenerationsBill",
            "#ParticipantEngagement",
            "#InformedChoice",
            "#DisabilityRights",
            "#NDISTransparency",
            "#NDISSupports",
            "#NDISAct",
            "#MainstreamSupports",
            "#CommunitySupports",
            "#SocialAndRecreationalSupports",
            "#ChangesToTheNDIS",
            "#SupportsUnderTheNDIS",
            "#Advocacy",
            "#DisabilityAdvocacy",
          ].map(tag => (
            <span key={tag} style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "99px", padding: "4px 12px", lineHeight: 1.5 }}>{tag}</span>
          ))}
        </div>
      </div>
    </>
  );
}

function FlippingTheScriptArticle() {
  return (
    <>
      <p>
        The traditional support matching system treats care like a passive wildcard. When a client's needs change, or when a provider releases a fresh intake brief, the standard response is highly reactive. Coordinators frantically look at a spreadsheet of basic worker certifications, pick a name, and hope for the best.
      </p>
      <p>
        This reactive loop doesn't just create high turnover — it creates anxiety on both sides. A participant is forced to constantly retrain new people, while support workers step into homes sometimes completely blind to the specific, nuanced realities of that household.
      </p>
      <p>
        True person-centred care requires a proactive system. By shifting away from rigid, text-heavy static profiles and using interactive digital templates, the care sector can transform how workers respond to client needs in real-time.
      </p>

      <h2>Scenario 1 — The Targeted Video Response to Intake Briefs</h2>
      <p>
        Imagine a local service provider onboarding a new NDIS participant. The client's intake brief specifies highly unique, non-negotiable requirements: they have severe sensory processing sensitivities, utilise an alternative communication device, and need a worker who understands how to navigate high-anxiety transitions without triggering a meltdown.
      </p>
      <p>
        In the old system, a provider would post this shift, receive fifty generic support worker responses and spend days guessing who might have the actual soft skills to handle it.
      </p>
      <p>With interactive and accessibility-focused profiling, the dynamic shifts entirely:</p>
      <ol>
        <li><strong>The Brief as a Trigger</strong> — the support worker receives the details of the specific intake brief.</li>
        <li><strong>The Proactive Pivot</strong> — instead of sending a standard stock outline, the worker records a short, targeted video response addressing those exact needs and uploads it directly into their profile.</li>
        <li><strong>The Proof</strong> — in the video, the worker speaks directly to the client's family: <em>"I read that transitions are a major trigger point. In my previous work with neurodivergent clients, I use a visual schedule and a low-demand approach twenty minutes before we leave the house. Here is how I adjust my tone of voice to keep the environment calm..."</em></li>
      </ol>
      <p>
        When the family reviews the worker's profile received by email, they aren't just reading that the worker is "experienced." They are seeing a live demonstration of the worker's strategy, tone, and reasoning — the persona — before they ever step foot in the home.
      </p>

      <h2>Scenario 2 — Show, Don't Tell: Demonstrating Real Skills and Achievements</h2>
      <p>
        A massive flaw in standard support matching is that the most critical care skills — physical transfers, meal preparation for dysphagia, implementing positive behaviour support plans — cannot be proven on a piece of paper. Anyone can write "experienced with manual handling" on a CV or profile.
      </p>
      <p>Interactive profiles allow workers to use their video space as a living portfolio to showcase real stories, achievements, and practical demonstrations:</p>
      <ul>
        <li><strong>Visual Proof of Competency</strong> — a worker can use their video to walk through exactly how they set up a safe environment for a ceiling hoist transfer, or how they prepare texture-modified meals according to speech pathology guidelines.</li>
        <li><strong>Real Stories of Independence</strong> — instead of listing clinical jargon, a worker can share an anonymous, respectful story of an achievement: <em>"Last year, I worked with a young man who hadn't left his house in six months due to agoraphobia. By building a gradual, low-pressure community access routine over four months, we successfully visited his local cafe together."</em></li>
      </ul>
      <p>
        Hearing a worker narrate their successes gives participants and coordinators deep insight into their values, their humility, and their commitment to fostering client independence rather than dependence.
      </p>

      <h2>A Dignified, Human-First Infrastructure</h2>
      <p>
        When support workers have the infrastructure to update and adapt their profiles dynamically, they stop being passive numbers in a database. They become active professionals who can tailor their presentation to match the exact human being they want to support.
      </p>
      <p>
        The care sector can finally match the complexity of human needs with a flexible, transparent, and profoundly person-centred solution — one profile at a time.
      </p>

      <p>
        <a href="/view" style={{ color: "#f5c842" }}>See what an interactive support worker profile looks like →</a>
      </p>

      <div style={{ marginTop: "48px", padding: "28px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px" }}>
        <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "16px" }}>Related Topics</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {[
            "#PersonCentredCare",
            "#NDISSupportMatching",
            "#SupportWorkerProfile",
            "#InteractiveProfile",
            "#ProactiveCare",
            "#NDISParticipant",
            "#SupportCoordinator",
            "#ChoiceAndControl",
            "#DisabilitySupport",
            "#NDISAustralia",
            "#InformedChoice",
            "#SupportWorker",
          ].map(tag => (
            <span key={tag} style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "99px", padding: "4px 12px", lineHeight: 1.5 }}>{tag}</span>
          ))}
        </div>
      </div>
    </>
  );
}

function MorePowerToYouArticle() {
  return (
    <>
      <p>
        Choosing a support worker is one of the biggest decisions a person can make.
      </p>
      <p>
        It’s not just about qualifications or availability. It’s someone you can spend hours with, trust, communicate with, and feel comfortable having in your life. That decision deserves more than a name on a list.
      </p>

      <h2>What InSync Profiles puts in your hands</h2>
      <p>
        InSync Profiles has built a participant-led tool that puts real information in people’s hands before they make that decision. Participants, carers, family members, and nominees can explore an interactive support worker profile designed to be accessible, inclusive, and easy to engage with — on any device, without needing an account or technical knowledge.
      </p>
      <p>
        Every profile includes simple ways to connect and communicate:
      </p>
      <ul>
        <li>Use the <strong>Message Me</strong> button to ask questions and find out more before committing to anything.</li>
        <li>Use the <strong>Feedback</strong> button to let the support worker or provider know your decision, or to share feedback after support has been delivered.</li>
      </ul>
      <p>
        These aren’t just features. They’re the infrastructure for a conversation that should have been possible from the start.
      </p>

      <h2>Choice and control needs something to choose from</h2>
      <p>
        The NDIS is built on the principle that participants have the right to choose who supports them. But choice and control only means something when people have something meaningful to choose from.
      </p>
      <p>
        InSync Profiles supports the principles behind the core rights of NDIS participants by making information easier to access, reinforcing choice and control, and enabling genuinely informed decisions. When a participant can see a worker’s communication style, hear their voice, read how they approach support, and ask questions before a single shift is booked — that is what informed choice actually looks like in practice.
      </p>

      <h2>See it for yourself</h2>
      <p>
        Meet Jordan — a sample living support worker profile available online for everyone to experience. It’s not a mockup or a screenshot. It’s the real thing, built on the same template every InSync Profiles worker uses.
      </p>
      <p>
        <a href="https://tinyurl.com/23yevwbf" target="_blank" rel="noopener noreferrer" style={{ color: "#f5c842" }}>View Jordan’s profile →</a>
      </p>
      <p>
        Or visit <a href="/view" style={{ color: "#f5c842" }}>insyncprofiles.net/view</a> to see what a participant sees when they open a profile for the first time.
      </p>

      <p style={{ fontStyle: "italic", marginTop: "32px" }}>More power to You.</p>

      <div style={{ marginTop: "48px", padding: "28px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px" }}>
        <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "16px" }}>Related Topics</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {[
            "#ParticipantPerspective",
            "#SupportMatters",
            "#NDISCompliance",
            "#ChoiceAndControl",
            "#NDISSupport",
            "#NDISProvider",
            "#InclusionAndDiversity",
            "#InformedChoice",
            "#ParticipantRights",
            "#SupportWorker",
            "#NDISAustralia",
          ].map(tag => (
            <span key={tag} style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "99px", padding: "4px 12px", lineHeight: 1.5 }}>{tag}</span>
          ))}
        </div>
      </div>
    </>
  );
}

// ── "When I'm Well" Article ─────────────────────────────────────────────
function WhenImWellArticle() {
  return (
    <>
      <p>
        Most support systems only ever see a person at their worst.
      </p>
      <p>
        By the time a support worker, nurse, hospital clinician, or new service meets someone with a disability, that person is often in crisis — overwhelmed, non-verbal, dysregulated, or in pain. That becomes the worker's entire frame of reference for who that person is. It shapes how they speak to them, what they assume about their capacity, and what they believe is possible.
      </p>
      <p>
        The About Me profile on InSync Profiles includes a <strong>When I'm Well</strong> section — and an option to include a short video of the person when they are at their best. It is one of the most quietly significant features in the platform. Here is why.
      </p>

      <h2>The frame problem in disability support</h2>
      <p>
        Every new intake, every hospital admission, every support transition begins with a first impression. And for many people with disability, that first impression is formed in a moment of difficulty — a meltdown, a medical episode, a period of heightened anxiety, or simply the stress of meeting a stranger.
      </p>
      <p>
        That moment is not representative. But without anything else to go on, it becomes the lens through which the person is seen — sometimes for the entire duration of that support relationship.
      </p>
      <p>
        A When I'm Well video breaks that frame entirely.
      </p>

      <h2>What a 30-second video actually does</h2>
      <p>
        When a clinician, support worker, or hospital nurse has seen a short video of a person telling a joke, talking about their dog, or showing what they love to do — they treat that person differently. Not because they are trying harder. Because they know more.
      </p>
      <p>
        They have seen the person communicate. They have seen them animated, engaged, and themselves. They carry that image into every interaction, including the hard ones.
      </p>
      <p>
        For someone who is non-verbal or minimally verbal during a crisis, this is especially powerful. A video of that person using AAC to describe their favourite meal, or laughing with a family member, communicates something that no written profile can: <em>this is a full human being, and this is who they are when the world is working for them.</em>
      </p>

      <h2>Countering diagnostic overshadowing</h2>
      <p>
        Diagnostic overshadowing is the tendency — well-documented in clinical literature — to attribute everything about a person to their diagnosis. Pain gets dismissed as "part of the condition." Distress gets read as "typical behaviour." Capacity gets underestimated because the professional's only data point is the person in a difficult moment.
      </p>
      <p>
        The When I'm Well section directly counters this. It gives every new provider a baseline — a reference point for who this person is at their best — before the first interaction. That baseline changes what gets noticed, what gets asked, and what gets assumed.
      </p>

      <h2>In hospital settings</h2>
      <p>
        Hospital admissions are among the highest-risk moments for people with disability. The environment is unfamiliar, the sensory load is extreme, the routines are gone, and the people are strangers. For someone who relies on predictability and familiar faces, it is a perfect storm.
      </p>
      <p>
        An About Me profile — with a When I'm Well video — gives ED staff and ward nurses an immediate, human anchor. They know the person's name, their communication style, their triggers, their preferences, and what a good day looks like. They have seen them well. That changes the quality of care from the first minute.
      </p>
      <p>
        This is not hypothetical. It is what person-centred care is supposed to look like — and it almost never happens in practice because the information does not exist in a portable, accessible form. Until now.
      </p>

      <h2>For new support workers</h2>
      <p>
        A support worker who has watched a participant's When I'm Well video before their first shift arrives differently. They are not walking in blind. They have context. They have a sense of who this person is, what they enjoy, how they communicate when things are going well.
      </p>
      <p>
        That changes the first interaction. It reduces the awkwardness of a stranger relationship. It gives the worker something genuine to connect over — not a list of deficits, but a person.
      </p>

      <h2>For families</h2>
      <p>
        There is something else the When I'm Well section does that is harder to quantify but no less real.
      </p>
      <p>
        For families who spend a significant amount of their time managing crises, navigating systems, and advocating in difficult circumstances — having a record of their person at their best is quietly important. It is a reminder, and a document, of who their family member is when the world is not making things hard.
      </p>
      <p>
        That matters. Not just for the people reading the profile. For the family who built it.
      </p>

      <h2>What the standard toolkit is missing</h2>
      <p>
        Support plans describe needs. Care plans describe risks. Intake forms capture diagnoses, medications, and behaviours of concern.
      </p>
      <p>
        None of them ask: <em>What does this person look like when they are well?</em>
      </p>
      <p>
        That question is not in the standard toolkit. The About Me profile is the only place in the NDIS ecosystem where it gets answered — in the person's own voice, in their own words, and on their own terms.
      </p>

      <p>
        About Me profiles are free. Always. <a href="/about-me/editor" style={{ color: "#f5c842" }}>Build yours at insyncprofiles.net →</a>
      </p>

      <div style={{ marginTop: "48px", padding: "28px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px" }}>
        <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "16px" }}>Related Topics</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {[
            "#AboutMeProfile",
            "#WhenImWell",
            "#PersonCentredCare",
            "#NDISParticipant",
            "#DiagnosticOvershadowing",
            "#DisabilityInclusion",
            "#HospitalAdmission",
            "#ContinuityOfCare",
            "#SupportWorker",
            "#NDISAustralia",
            "#ChoiceAndControl",
            "#CommunicationSupport",
            "#AAC",
            "#Neurodivergent",
            "#CarerSupport",
            "#InformedCare",
          ].map(tag => (
            <span key={tag} style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "99px", padding: "4px 12px", lineHeight: 1.5 }}>{tag}</span>
          ))}
        </div>
      </div>
    </>
  );
}

// ── Article metadata registry ─────────────────────────────────────────────
const ARTICLES: Record<string, {
  title: string;
  date: string;
  readTime: string;
  category: string;
  emoji: string;
  metaDescription: string;
  ogImage?: string;
  keywords?: string;
  content: () => React.ReactElement;
}> = {
  "more-power-to-you": {
    title: "More power to You — A Participant-Led Journey into the Most Important Decisions of Their Life",
    date: "June 2026",
    readTime: "4 min read",
    category: "Participant Choice",
    emoji: "💪",
    metaDescription: "Choosing a support worker is one of the biggest decisions a person can make. InSync Profiles puts real, accessible information in participants' hands before that decision is made.",
    keywords: "NDIS participant choice, support worker profile, informed choice NDIS, participant-led support, NDIS choice and control, interactive support worker profile, accessible NDIS tool, InSync Profiles",
    content: MorePowerToYouArticle,
  },
  "flipping-the-script": {
    title: "Flipping the Script: Moving from Static Support Worker Profiles to Proactive Care Alliances",
    date: "June 2026",
    readTime: "8 min read",
    category: "Person-Centred Care",
    emoji: "🔄",
    metaDescription: "The traditional support matching system is reactive, creating anxiety for participants and workers alike. Discover how interactive digital profiles transform care matching into a proactive, person-centred alliance.",
    keywords: "NDIS support matching, interactive support worker profile, person-centred care NDIS, proactive care alliance, support worker video profile, NDIS participant choice, disability support matching Australia, InSync Profiles",
    content: FlippingTheScriptArticle,
  },
  "lanyard-card-benefits": {
    title: "From Invisible to Unmissable: Your Lanyard Card Is a Walking Billboard That Turns Every Moment Into a Client Connection",
    date: "June 2026",
    readTime: "4 min read",
    category: "Tips & Strategy",
    emoji: "🪴",
    metaDescription: "Discover how the InSync Profiles lanyard card helps NDIS support workers go from invisible to unmissable — in the community, on errands, and at events — with a single QR code scan.",
    keywords: "NDIS support worker lanyard card, QR code support worker, NDIS worker marketing, support worker personal brand, NDIS independent worker tips, how to attract NDIS clients, support worker business card alternative, digital profile NDIS worker Australia",
    content: LanyardCardBenefitsArticle,
  },
  "sea-of-sameness": {
    title: `Tearing Down the "Sea of Sameness": Why Traditional Social Media Posts Are Failing Australian Support Workers`,
    date: "May 2026",
    readTime: "5 min read",
    category: "Industry Insights",
    emoji: "🌊",
    metaDescription: "Discover why generic social media posts are failing NDIS support workers and how InSync Profiles's digital profile platform helps workers stand out in the Australian care sector.",
    keywords: "NDIS support worker social media, sea of sameness disability sector, support worker digital profile Australia, NDIS worker stand out, InSync Profiles, disability support worker marketing, NDIS independent worker visibility",
    content: SeaOfSamenessArticle,
  },
  "when-im-well": {
    title: "When I'm Well: Why a 30-Second Video Changes Everything in Disability Support",
    date: "July 2026",
    readTime: "5 min read",
    category: "Person-Centred Care",
    emoji: "🌱",
    metaDescription: "Most support systems only see a person at their worst. The About Me profile's When I'm Well video feature gives clinicians, support workers, and hospitals a baseline — who this person is when the world is working for them.",
    keywords: "About Me NDIS profile, when I'm well disability, person-centred care NDIS, diagnostic overshadowing disability, NDIS participant hospital, continuity of care NDIS, About Me profile free NDIS, support worker first shift, disability communication profile, InSync Profiles",
    content: WhenImWellArticle,
  },
  "who-is-going-to-support-me": {
    title: "Who is going to support me?",
    date: "June 2026",
    readTime: "6 min read",
    category: "Informed Choice",
    emoji: "🧭",
    metaDescription: "Informed choice is a right — not a privilege. Yet most NDIS participants are still asked to choose a support worker based on a name, a gender, and a time slot. The 2026 reforms are changing that.",
    ogImage: "https://insyncprofiles.net/assets/informed_choice_gap_real.jpg",
    keywords: "NDIS informed choice, NDIS 2026 reforms participant rights, support worker selection NDIS, supported decision making NDIS, NDIS participant choice and control, NDIS Future Generations Bill 2026, participant engagement NDIS provider, how to choose a support worker Australia, NDIS transparency reforms, disability support worker profile",
    content: WhoIsGoingToSupportMeArticle,
  },
};

interface BlogPostProps {
  slug?: string;
}

export default function BlogPost({ slug = "sea-of-sameness" }: BlogPostProps) {
  const article = ARTICLES[slug];

  if (!article) {
    return (
      <div style={{ minHeight: "100vh", background: C.bgPage, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit', sans-serif" }}>
        <div style={{ textAlign: "center", color: C.textBody }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📄</div>
          <h1 style={{ color: C.textHead, marginBottom: "12px" }}>Article not found</h1>
          <Link href="/blog"><span style={{ color: C.gold, cursor: "pointer" }}>← Back to Blog</span></Link>
        </div>
      </div>
    );
  }

  const ArticleContent = article.content;

  // Dynamic SEO for this article
  useSEO({
    title: `${article.title} | InSync Profiles Blog`,
    description: article.metaDescription,
    canonical: `https://insyncprofiles.net/blog/${slug}`,
  });

  // Inject OG image and keywords dynamically
  useEffect(() => {
    const ogImage = document.querySelector('meta[property="og:image"]') as HTMLMetaElement | null;
    if (ogImage) ogImage.content = article.ogImage || "https://insyncprofiles.net/assets/insync_og_default.jpg";
    const twImage = document.querySelector('meta[name="twitter:image"]') as HTMLMetaElement | null;
    if (twImage) twImage.content = article.ogImage || "https://insyncprofiles.net/assets/insync_og_default.jpg";
    // Keywords
    let kwEl = document.querySelector('meta[name="keywords"]') as HTMLMetaElement | null;
    if (!kwEl) {
      kwEl = document.createElement("meta");
      kwEl.name = "keywords";
      document.head.appendChild(kwEl);
    }
    kwEl.content = article.keywords || "NDIS support worker, InSync Profiles, disability support Australia";
    return () => {
      const ogImg = document.querySelector('meta[property="og:image"]') as HTMLMetaElement | null;
      if (ogImg) ogImg.content = "https://insyncprofiles.net/assets/insync_og_default.jpg";
    };
  }, [article]);

  return (
    <div style={{ minHeight: "100vh", background: C.bgPage, fontFamily: "'Outfit', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Outfit:wght@400;500;600;700;800&display=swap');
        .article-body h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(22px, 3vw, 30px);
          font-weight: 700;
          color: ${C.textHead};
          margin: 40px 0 16px;
          line-height: 1.25;
        }
        .article-body h3 {
          font-family: 'Outfit', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: ${C.gold};
          margin: 28px 0 12px;
        }
        .article-body p {
          font-size: 17px;
          color: ${C.textBody};
          line-height: 1.85;
          margin: 0 0 20px;
        }
        .article-body blockquote {
          border-left: 3px solid ${C.gold};
          margin: 24px 0;
          padding: 16px 24px;
          background: rgba(245,200,66,0.06);
          border-radius: 0 12px 12px 0;
        }
        .article-body blockquote p {
          font-style: italic;
          color: rgba(255,255,255,0.65);
          margin: 0 0 8px;
          font-size: 16px;
        }
        .article-body blockquote p:last-child { margin: 0; }
        .article-body ul {
          margin: 0 0 24px;
          padding-left: 0;
          list-style: none;
        }
        .article-body ul li {
          font-size: 16px;
          color: ${C.textBody};
          line-height: 1.75;
          margin-bottom: 14px;
          padding-left: 20px;
          position: relative;
        }
        .article-body ul li::before {
          content: '✦';
          position: absolute;
          left: 0;
          color: ${C.gold};
          font-size: 10px;
          top: 6px;
        }
        .article-body strong { color: ${C.textHead}; }
        .article-body a { color: ${C.gold}; text-decoration: underline; }
      `}</style>

      {/* Article header */}
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "130px 24px 0" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "32px", fontSize: "13px", color: C.textDim }}>
          <Link href="/"><span style={{ color: C.textDim, cursor: "pointer", textDecoration: "none" }}>Home</span></Link>
          <span>›</span>
          <Link href="/blog"><span style={{ color: C.textDim, cursor: "pointer", textDecoration: "none" }}>Blog</span></Link>
          <span>›</span>
          <span style={{ color: C.textBody }}>Article</span>
        </div>

        {/* Category + meta */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "28px" }}>{article.emoji}</span>
          <span style={{ background: `rgba(45,212,191,0.12)`, border: `1px solid rgba(45,212,191,0.3)`, borderRadius: "99px", padding: "3px 12px", fontSize: "11px", fontWeight: 700, color: C.teal, letterSpacing: "0.06em", textTransform: "uppercase" }}>{article.category}</span>
          <span style={{ fontSize: "13px", color: C.textDim }}>{article.date} · {article.readTime}</span>
        </div>

        {/* Title */}
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 700, color: C.textHead, margin: "0 0 32px", lineHeight: 1.15 }}>
          {article.title}
        </h1>

        {/* Divider */}
        <div style={{ height: "1px", background: `linear-gradient(90deg, ${C.gold} 0%, transparent 100%)`, marginBottom: "40px", opacity: 0.4 }} />
      </div>

      {/* Article body */}
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "0 24px 100px" }}>
        <div className="article-body">
          <ArticleContent />
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: C.border, margin: "60px 0 48px" }} />

        {/* CTA */}
        <div style={{ textAlign: "center", padding: "48px 32px", background: `rgba(245,200,66,0.06)`, border: `1px solid ${C.borderGold}`, borderRadius: "20px", marginBottom: "48px" }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>💼</div>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", fontWeight: 700, color: C.textHead, margin: "0 0 12px" }}>Ready to stand out?</h3>
          <p style={{ fontSize: "15px", color: C.textBody, margin: "0 0 24px", lineHeight: 1.7 }}>
            Build your InSync Profiles profile and stop being invisible in the support sector.
          </p>
          <Link href="/pricing">
            <button style={{ padding: "14px 36px", borderRadius: "99px", background: `linear-gradient(135deg, #f5c842 0%, #e6a817 100%)`, border: "none", color: "#0d1b2a", fontFamily: "'Outfit', sans-serif", fontSize: "15px", fontWeight: 800, cursor: "pointer", letterSpacing: "0.02em" }}>
              Get Started →
            </button>
          </Link>
        </div>

        {/* Back to blog */}
        <div style={{ textAlign: "center" }}>
          <Link href="/blog">
            <span style={{ color: C.gold, fontWeight: 700, fontSize: "14px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back to all articles
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
