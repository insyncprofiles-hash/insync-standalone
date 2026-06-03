/* ============================================================
   Legal & Privacy Page — Australian Privacy Act 1988 compliant
   Covers: Privacy Policy + Terms of Sale + Buyer Responsibility
   Updated: 23 May 2026
   ============================================================ */
import { useEffect } from "react";
import { Link } from "wouter";

const LAST_UPDATED = "23 May 2026";
const CONTACT_EMAIL = "insyncprofiles@gmail.com";
const SITE_NAME = "InSync Profiles";
const PRODUCT_NAME = "InSync Profiles Support Worker Profile Template";

const BG = "oklch(0.08 0.05 155)";
const BG2 = "oklch(0.12 0.06 155)";
const GOLD = "oklch(0.72 0.14 75)";
const TEXT = "oklch(0.75 0.03 130)";
const HEAD = "oklch(0.96 0.01 78)";
const DIM  = "oklch(0.55 0.04 155)";
const BORDER = "oklch(0.72 0.14 75 / 18%)";

export default function Privacy() {
  // Prevent search engines from indexing this page (contains ABN and legal content)
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    meta.setAttribute("data-privacy-page", "true");
    document.head.appendChild(meta);
    return () => {
      const existing = document.head.querySelector('meta[data-privacy-page="true"]');
      if (existing) document.head.removeChild(existing);
    };
  }, []);

  return (
    <div className="min-h-screen" style={{ background: BG, color: HEAD }}>

      {/* Hero */}
      <div className="text-center py-16 px-6" style={{ borderBottom: `1px solid ${BORDER}`, paddingTop: "110px" }}>
        <p className="text-xs tracking-widest uppercase mb-3" style={{ color: `${GOLD}b0`, fontFamily: "'Outfit', sans-serif" }}>Legal</p>
        <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", color: HEAD }}>
          Legal &amp; Privacy
        </h1>
        <p className="text-sm" style={{ color: DIM, fontFamily: "'Outfit', sans-serif" }}>
          Last updated: {LAST_UPDATED} · Australian Privacy Act 1988 · Digital Product Terms
        </p>
        <div className="flex flex-wrap gap-3 justify-center mt-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
          {[
            ["#terms",   "Terms of Sale"],
            ["#buyer",   "Buyer Responsibility"],
            ["#brand",   "Brand & Copyright"],
            ["#refunds", "No Refunds"],
            ["#privacy", "Privacy Policy"],
            ["#paypal",  "PayPal & Email Data"],
            ["#media",   "Media & Consent"],
          ].map(([href, label]) => (
            <a key={href} href={href} style={{ fontSize: "12px", color: GOLD, border: `1px solid ${GOLD}44`, borderRadius: "99px", padding: "5px 14px", textDecoration: "none", background: `${GOLD}10` }}>{label}</a>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-12" style={{ fontFamily: "'Outfit', sans-serif" }}>

        {/* ── PLAIN ENGLISH SUMMARY ── */}
        <div className="rounded-2xl p-6 mb-12" style={{ background: `${GOLD}10`, border: `1.5px solid ${GOLD}44` }}>
          <h2 className="text-lg font-bold mb-4" style={{ color: GOLD, fontFamily: "'Cormorant Garamond', serif" }}>Plain English Summary</h2>
          <ul className="space-y-3 text-sm" style={{ color: TEXT }}>
            <li>⚖️ <strong style={{ color: HEAD }}>Sold as-is as a digital template.</strong> Once delivered, all responsibility for content, accuracy, and use rests entirely with the buyer.</li>
            <li>🚫 <strong style={{ color: HEAD }}>No refunds.</strong> All sales are final once the licence key is issued.</li>
            <li>🏷️ <strong style={{ color: HEAD }}>InSync Profiles branding must remain</strong> on all templates sold. No reselling rights.</li>
            <li>📧 <strong style={{ color: HEAD }}>PayPal sends us your name and email</strong> for product delivery. It may also be used for future product updates — you can opt out at any time.</li>
            <li>🗄️ <strong style={{ color: HEAD }}>No purchase database exists.</strong> We do not store your purchase details in any database, CRM, or spreadsheet. Your information lives only in the PayPal payment notification email in our inbox.</li>
            <li>🔑 <strong style={{ color: HEAD }}>You receive a licence key.</strong> Once payment is confirmed, you'll receive a licence key to activate your InSync Profiles profile editor at insyncprofiles.net/editor.</li>
            <li>🔒 <strong style={{ color: HEAD }}>Your profile data never leaves your browser.</strong> Everything typed into the editor stays on your device only.</li>
            <li>🗣 <strong style={{ color: HEAD }}>Try before you buy at insyncprofiles.net/demo.</strong> The free demo lets you explore the full template — including the AAC communication board, text-to-speech, dyslexia font, high contrast mode, and text size controls — before committing to a purchase.</li>
            <li>🤝 <strong style={{ color: HEAD }}>Client references in your profile require their consent.</strong> This is entirely the buyer's responsibility.</li>
            <li>✅ <strong style={{ color: HEAD }}>We do not sell your data.</strong> Ever. To anyone.</li>
          </ul>
        </div>

        {/* ══════════════════════════════════════
            PART A — TERMS OF SALE
        ══════════════════════════════════════ */}
        <div id="terms" style={{ borderTop: `2px solid ${GOLD}33`, paddingTop: "40px", marginBottom: "12px" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: GOLD, fontFamily: "'Outfit', sans-serif", marginBottom: "8px" }}>Part A</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", color: HEAD, fontSize: "28px", fontWeight: 700, marginBottom: "4px" }}>Terms of Sale</h2>
          <p style={{ color: DIM, fontSize: "12px", marginBottom: "32px" }}>Applies to all purchases of the {PRODUCT_NAME}</p>
        </div>

        <Section title="1. The Product">
          <p>
            {PRODUCT_NAME} ("the Template") is a <strong>digital product</strong> — a browser-based HTML/CSS/JavaScript profile template designed for use by support workers in the Australian disability, aged care, and NDIS sectors.
          </p>
          <p className="mt-3">
            The Template is <strong>accessibility-first by design</strong>. It includes a built-in AAC (Augmentative and Alternative Communication) symbol board for face-to-face client interactions, text-to-speech (Read Aloud), a dyslexia-friendly font (Lexend), high contrast mode, adjustable text size, and reduce-motion controls. These features are available to all users of a published profile, not just the profile owner.
          </p>
          <p className="mt-3">
            The Template operates on a <strong>two-route system</strong>: <code>/demo</code> (free public trial — no key required, watermarked preview) and <code>/editor</code> (buyer-only — requires a valid licence key, fully unlocked profile editor).
          </p>
          <p className="mt-3">
            The Template is provided <strong>as-is</strong> as a ready-to-use digital tool. It is not a professional service, not a registered NDIS product, and not affiliated with the NDIS Commission, any government body, or any registered provider.
          </p>
          <p className="mt-3">
            By completing a purchase, you ("the Buyer") agree to all terms set out in this document in full.
          </p>
        </Section>

        <Section title="2. Delivery of the Product">
          <p>
            Upon successful payment via <strong>PayPal</strong> (the sole accepted payment method), the Buyer will receive access to the Template via a link delivered to the email address associated with their PayPal account. Delivery is typically completed within <strong>24 hours</strong> of confirmed payment, often sooner.
          </p>
          <p className="mt-3">
            <strong>Access is via licence key.</strong> Once payment is confirmed, you'll receive a licence key to activate your profile editor. No downloads, no installs.
          </p>
          <p className="mt-3">
            If you have not received your licence key or require assistance, contact us at <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: GOLD }}>{CONTACT_EMAIL}</a> with your PayPal transaction reference number.
          </p>
          <p className="mt-3">
            Access is considered granted once the licence key has been issued. {SITE_NAME} is not responsible for issues caused by incorrect email addresses or email provider filtering beyond our control.
          </p>
          <p className="mt-3">
            <strong>Welcome modal on first activation:</strong> When a valid licence key is entered for the first time, a welcome modal is displayed to the Buyer confirming successful activation. The Buyer's first activation also triggers an automated owner notification (see Section 12) so that {SITE_NAME} is aware the key has been used.
          </p>
          <p className="mt-3">
            <strong>Where is profile data saved?</strong> The Template is a browser-based tool. All profile data entered by the Buyer (name, bio, services, photos, video, etc.) is stored <strong>only within the Buyer's own browser</strong> on their device. No profile data is transmitted to or stored on {SITE_NAME}'s servers. The Buyer is responsible for saving or exporting their work.
          </p>
        </Section>

        <Section title="3. Licence">
          <p>
            Upon purchase, the Buyer is granted a <strong>non-exclusive, non-transferable, personal licence</strong> to use the Template for their own professional profile. Licence tiers:
          </p>
          <ul className="list-disc pl-5 mt-3 space-y-2">
            <li><strong>Solo:</strong> use by one individual support worker</li>
            <li><strong>Team:</strong> use by up to 5 workers within a single organisation</li>
            <li><strong>Team 10:</strong> use by up to 10 workers within a single organisation</li>
          </ul>
          <p className="mt-3">
            The Buyer may <strong>not</strong> resell, redistribute, sublicense, or share the Template files with individuals or organisations beyond the scope of their purchased licence tier.
          </p>
          <p className="mt-3">
            Each licence key is <strong>single-use per buyer</strong> — it is issued to one individual or team and is not transferable. Licence keys may be revoked without refund in the event of a breach of these terms, including but not limited to: sharing the key with unauthorised users, reselling the Template, or using the Template in a manner inconsistent with the purchased licence tier.
          </p>
          <p className="mt-3" style={{ fontWeight: 700, color: "#c0392b" }}>
            ⛔ Reselling is strictly prohibited. This licence is for personal professional use only. The Template may not be on-sold, repackaged, gifted to third parties, or commercially exploited in any form. Any breach of this condition will result in immediate revocation of the licence without refund.
          </p>
        </Section>

        {/* ── BUYER RESPONSIBILITY ── */}
        <div id="buyer" style={{ scrollMarginTop: "120px" }}>
          <Section title="4. Buyer Responsibility — Content, Data & Use">
            <div className="rounded-xl p-5 mb-4" style={{ background: `${GOLD}0d`, border: `1.5px solid ${GOLD}44` }}>
              <p style={{ color: GOLD, fontWeight: 700, fontSize: "14px", marginBottom: "6px" }}>⚠️ Important — Please Read Carefully</p>
              <p style={{ color: TEXT, fontSize: "13px", lineHeight: 1.7 }}>
                Once the Buyer has activated the Template, <strong style={{ color: HEAD }}>all responsibility for its content, accuracy, and use rests entirely with the Buyer.</strong>
              </p>
            </div>
            <p>The Buyer is solely responsible for:</p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li>All data, text, and media they populate the Template fields with, including but not limited to: name, contact details, qualifications, credentials, experience claims, service descriptions, photos, and videos</li>
              <li>Ensuring that all information published via the Template is accurate, truthful, and not misleading</li>
              <li>The Buyer's credentials, personal information, skills, qualifications, and experience claims are entirely the Buyer's own responsibility and onus — {SITE_NAME} makes no verification of any such claims and accepts no liability in relation to them</li>
              <li>Any claim by the Buyer to be associated with a third-party organisation, employer, or provider is the Buyer's sole responsibility and has nothing to do with {SITE_NAME}</li>
              <li>Compliance with all applicable laws, including but not limited to: the Australian Consumer Law, the NDIS Act 2013, the Aged Care Act 1997, privacy legislation, and any relevant sector codes of conduct</li>
              <li>NDIS Worker Screening requirements and any mandatory registration or compliance obligations relevant to their role</li>
              <li>Any consequences arising from how the published profile is received, interpreted, or acted upon by third parties including employers, clients, families, or support coordinators</li>
            </ul>
            <p className="mt-4">
              <strong>{SITE_NAME} provides the Template as a digital tool only.</strong> We make no representations about the suitability of the Template for any specific employment, registration, or compliance purpose. The Template does not constitute professional advice of any kind.
            </p>
          </Section>
        </div>

        {/* ── BRAND & COPYRIGHT ── */}
        <div id="brand" style={{ scrollMarginTop: "120px" }}>
          <Section title="5. Brand, Copyright & No Reselling Rights">
            <p>
              The Template, including all code, design, layout, copy, and visual elements, is the intellectual property of {SITE_NAME}. The Buyer's licence does not transfer ownership of the Template or any of its underlying components.
            </p>
            <p className="mt-3">
              <strong>InSync Profiles branding must remain on all templates sold and in use.</strong> The Buyer may not remove, obscure, or alter the {SITE_NAME} brand attribution displayed within the Template.
            </p>
            <p className="mt-3">
              <strong>No reselling rights are granted under any circumstances.</strong> The Buyer may not resell, redistribute, sublicense, repackage, gift, transfer, or commercially exploit the Template or any derivative of it in any form. Purchasing the Template grants a <strong>personal-use licence only</strong>, as described in Section 3. There are no reseller licences, affiliate arrangements, or on-selling permissions available for this product. Any attempt to resell or redistribute the Template will result in immediate licence revocation without refund, and may be subject to further legal action.
            </p>
            <p className="mt-3">
              Content entered by the Buyer (their name, bio, photos, etc.) remains the Buyer's own intellectual property.
            </p>
          </Section>
        </div>

        {/* ── MEDIA & CLIENT CONSENT ── */}
        <div id="media" style={{ scrollMarginTop: "120px" }}>
          <Section title="6. Media, Client References & Consent">
            <p>
              The Buyer is solely responsible for ensuring they hold all necessary rights, permissions, and consents for any media (photos, videos, audio) uploaded to the Template.
            </p>
            <p className="mt-3">
              <strong>Client references and consent:</strong> Any reference to past or present clients, recipients, or participants in the Buyer's profile — including in text descriptions, testimonials, or intro videos — requires the <strong>explicit prior authority and consent</strong> of those individuals. The Buyer must obtain and retain this consent independently. {SITE_NAME} accepts no responsibility for any privacy breach or legal claim arising from the inclusion of client references without proper consent.
            </p>
            <p className="mt-3">
              <strong>Storage and legal status of unsigned media:</strong> The Buyer acknowledges that photos, videos, and other media included in their published profile may be publicly accessible via their shared profile link. The Buyer is responsible for ensuring that all media is appropriately licensed, that any individuals depicted have consented to their image being used in this context, and that no media infringes third-party intellectual property or privacy rights. {SITE_NAME} accepts no legal responsibility for unsigned, unlicensed, or disputed media included by the Buyer.
            </p>
          </Section>
        </div>

        <Section title="7. Limitation of Liability">
          <p>To the maximum extent permitted by Australian law, {SITE_NAME} and its operators expressly exclude all liability for:</p>
          <ul className="list-disc pl-5 mt-3 space-y-2">
            <li>Any loss, damage, or harm arising from the Buyer's use of the Template or its published content</li>
            <li>Any employment, contractual, or professional outcomes (or lack thereof) resulting from use of the Template</li>
            <li>Any inaccurate, misleading, or non-compliant content entered by the Buyer</li>
            <li>Any third-party claims arising from content published by the Buyer using the Template</li>
            <li>Any claim by the Buyer to be associated with a third party — such claims are entirely the Buyer's own and have no connection to {SITE_NAME}</li>
            <li>Technical issues, browser incompatibilities, or data loss resulting from the Buyer's device or browser environment</li>
            <li>Any indirect, incidental, special, or consequential loss of any kind</li>
          </ul>
          <p className="mt-4">
            Where liability cannot be excluded under Australian Consumer Law, our liability is limited to resupply of the digital product or a refund of the purchase price, at our sole discretion.
          </p>
        </Section>

        {/* ── NO REFUNDS ── */}
        <div id="refunds" style={{ scrollMarginTop: "120px" }}>
          <Section title="8. No Refunds — Digital Product Policy">
            <div className="rounded-xl p-5 mb-4" style={{ background: "rgba(220,50,50,0.08)", border: "1.5px solid rgba(220,50,50,0.30)" }}>
              <p style={{ color: "#f87171", fontWeight: 700, fontSize: "14px", marginBottom: "6px" }}>🚫 All Sales Are Final</p>
              <p style={{ color: TEXT, fontSize: "13px", lineHeight: 1.7 }}>
                Due to the nature of digital products, <strong style={{ color: HEAD }}>we do not offer refunds once the product has been delivered.</strong> By completing your purchase, you acknowledge and agree to this policy.
              </p>
            </div>
            <p>
              This policy is consistent with the <strong>Australian Consumer Law (Schedule 2, Competition and Consumer Act 2010)</strong>. Digital products that have been accessed or downloaded are not subject to a general right of return, provided the product is as described and functions as represented.
            </p>
            <p className="mt-3">
              A <strong>free demo</strong> is available at <a href="/demo" style={{ color: GOLD }}>insyncprofiles.net/demo</a> prior to purchase so Buyers can evaluate the product before committing. The demo includes the full accessibility suite and a sample profile. By purchasing, the Buyer confirms they have reviewed the demo and understand what they are purchasing.
            </p>
            <p className="mt-3">Exceptions may be considered at our sole discretion only in cases of:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Proven non-access (licence key not received or not functioning despite a correct PayPal email address)</li>
              <li>A significant defect that renders the product fundamentally unusable and that we are unable to remedy</li>
            </ul>
            <p className="mt-3">
              To raise a delivery or defect issue, contact <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: GOLD }}>{CONTACT_EMAIL}</a> within 7 days of purchase with your PayPal transaction reference.
            </p>
          </Section>
        </div>

        {/* ══════════════════════════════════════
            PART B — PRIVACY POLICY
        ══════════════════════════════════════ */}
        <div id="privacy" style={{ borderTop: `2px solid ${GOLD}33`, paddingTop: "40px", marginTop: "48px", marginBottom: "12px" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: GOLD, fontFamily: "'Outfit', sans-serif", marginBottom: "8px" }}>Part B</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", color: HEAD, fontSize: "28px", fontWeight: 700, marginBottom: "4px" }}>Privacy Policy</h2>
          <p style={{ color: DIM, fontSize: "12px", marginBottom: "32px" }}>Compliant with the Australian Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs)</p>
        </div>

        <Section title="9. Who We Are">
          <p>
            {SITE_NAME} ("we", "us", "our") is an Australian digital product business. We operate this website and sell the {PRODUCT_NAME}.
          </p>
          <p className="mt-3">For privacy enquiries: <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: GOLD }}>{CONTACT_EMAIL}</a></p>
        </Section>

        <Section title="10. What Information We Collect">
          <h3 className="font-semibold mb-2 mt-4" style={{ color: HEAD }}>10.1 Template Users (Support Workers)</h3>
          <p>
            All information entered into the Template editor — name, bio, contact details (including phone number, WhatsApp number, and custom contact label), services, professional credentials (including self-reported insurance details such as Public Liability Insurance and Professional Indemnity Insurance), photos, and videos — is processed <strong>entirely within your own browser</strong>. This data is never transmitted to our servers, never stored in a database, and is not accessible to us at any time.
          </p>
          <p className="mt-3">
            <strong>QR codes</strong> displayed in the editor and on published profiles are generated entirely client-side from the Buyer's profile URL. No QR generation request is made to any external service or third-party API.
          </p>
          <p className="mt-3">
            The only exception is <strong>accessibility preferences</strong> (font size, contrast, dyslexia font, reduce motion), which are saved to your device's <code>localStorage</code>. This data never leaves your device.
          </p>

          <h3 className="font-semibold mb-2 mt-4" style={{ color: HEAD }}>10.2 Website Visitors</h3>
          <p>
            Our hosting platform (Manus) automatically collects standard server logs including IP addresses, browser type, pages visited, and timestamps. This is governed by Manus's own privacy policy. We collect only anonymous, aggregated page view analytics — no personal identifiers.
          </p>

          <h3 className="font-semibold mb-2 mt-4" style={{ color: HEAD }}>10.3 Purchasers — PayPal Email Data</h3>
          <p>See <a href="#paypal" style={{ color: GOLD }}>Section 12</a> for a full explanation of how purchaser email addresses are received, used, and handled.</p>
        </Section>

        <Section title="11. How We Use Your Information">
          <p>We use the limited information we receive solely for:</p>
          <ul className="list-disc pl-5 mt-3 space-y-2">
            <li>Delivering your purchased digital product</li>
            <li>Responding to customer support enquiries</li>
            <li>Sending product update or marketing communications — <strong>you may opt out at any time</strong> by emailing <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: GOLD }}>{CONTACT_EMAIL}</a> with "Opt Out" in the subject line</li>
            <li>Complying with our legal obligations</li>
          </ul>
          <p className="mt-3">
            We will never use your information for profiling or any purpose unrelated to your purchase, product updates, or your own enquiry.
          </p>
        </Section>

        {/* ── PAYPAL EMAIL SECTION ── */}
        <div id="paypal" style={{ scrollMarginTop: "120px" }}>
          <Section title="12. PayPal Purchases — How Your Email Is Handled">
            <div className="rounded-xl p-5 mb-5" style={{ background: `${GOLD}0d`, border: `1.5px solid ${GOLD}44` }}>
              <p style={{ color: GOLD, fontWeight: 700, fontSize: "14px", marginBottom: "8px" }}>📧 How PayPal delivery works</p>
              <p style={{ color: TEXT, fontSize: "13px", lineHeight: 1.75 }}>
                When you purchase via PayPal, PayPal sends us a payment notification email containing your <strong style={{ color: HEAD }}>name and email address</strong>. We use this to issue your licence key. This is the only reason we receive your personal information.
              </p>
            </div>

            <h3 className="font-semibold mb-2 mt-4" style={{ color: HEAD }}>Do we store your email in a database?</h3>
            <p>
              <strong>No.</strong> We do not maintain a customer database, CRM, mailing list, or spreadsheet of any kind. Your name and email address exist only within the PayPal payment notification email in our inbox. We do not copy, export, or transfer this information into any separate system. No purchase record is created on our end beyond what PayPal itself records.
            </p>

            <h3 className="font-semibold mb-2 mt-4" style={{ color: HEAD }}>Key activation notifications</h3>
            <p>
              When a buyer activates a licence key for the first time, an automated notification is sent to the {SITE_NAME} owner via the Manus platform's internal notification system. This notification contains only the timestamp of activation — no personal data, profile content, or payment details are included. This notification is used solely for operational awareness (confirming keys are being used as issued).
            </p>
            <p className="mt-3">
              Licence key management (issuance, activation status, and revocation) is handled via a password-protected admin page accessible only to the {SITE_NAME} owner. No buyer personal data is stored in this system — it tracks only key status.
            </p>

            <h3 className="font-semibold mb-2 mt-4" style={{ color: HEAD }}>Future use — marketing communications</h3>
            <p>
              Your email address <strong>may be used in future</strong> to notify you of product updates, new features, or relevant communications from {SITE_NAME}. You may <strong>opt out at any time</strong> by emailing <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: GOLD }}>{CONTACT_EMAIL}</a> with "Opt Out" in the subject line. We will honour all opt-out requests promptly.
            </p>
            <p className="mt-3">
              We will never add your email to a third-party marketing platform or share it with any other business for marketing purposes.
            </p>

            <h3 className="font-semibold mb-2 mt-4" style={{ color: HEAD }}>How long do we hold it?</h3>
            <p>
              PayPal payment notification emails are retained in our inbox for as long as reasonably necessary to confirm delivery, respond to support enquiries, and meet Australian tax and business record-keeping obligations (typically 5 years for financial records).
            </p>

            <h3 className="font-semibold mb-2 mt-4" style={{ color: HEAD }}>Your rights regarding this data</h3>
            <p>
              Under the Australian Privacy Act 1988, you may contact us at <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: GOLD }}>{CONTACT_EMAIL}</a> to access, correct, or request deletion of your information (subject to legal record-keeping obligations). We will respond within 30 days.
            </p>
            <p className="mt-3">
              If you are not satisfied, you may lodge a complaint with the <strong>Office of the Australian Information Commissioner (OAIC)</strong> at <a href="https://www.oaic.gov.au" target="_blank" rel="noopener noreferrer" style={{ color: GOLD }}>www.oaic.gov.au</a>.
            </p>

            <h3 className="font-semibold mb-2 mt-4" style={{ color: HEAD }}>PayPal's own privacy obligations</h3>
            <p>
              PayPal is an independent data controller for the payment transaction. Their collection and use of your personal and payment information is governed by <a href="https://www.paypal.com/au/legalhub/privacy-full" target="_blank" rel="noopener noreferrer" style={{ color: GOLD }}>PayPal's Privacy Policy</a>. We have no control over PayPal's data practices.
            </p>
          </Section>
        </div>

        <Section title="13. Disclosure of Personal Information">
          <p>We do not sell, trade, or rent your personal information to third parties.</p>
          <p className="mt-3">We may disclose personal information only in the following limited circumstances:</p>
          <ul className="list-disc pl-5 mt-3 space-y-2">
            <li><strong>PayPal:</strong> as required to process your purchase (governed by PayPal's own privacy policy)</li>
            <li><strong>Manus (hosting provider):</strong> for website hosting and infrastructure</li>
            <li><strong>Legal requirements:</strong> where required by Australian law, court order, or government authority</li>
          </ul>
        </Section>

        <Section title="14. Cookies and Tracking">
          <p>
            This website uses <strong>no advertising cookies</strong> and <strong>no cross-site tracking</strong>. We use anonymous analytics (aggregate page view counts only — no personal identifiers, no cookies). Accessibility preferences are stored in your browser's <code>localStorage</code> on your device only and are not accessible to us.
          </p>
        </Section>

        <Section title="15. Overseas Disclosure">
          <p>
            Our hosting and payment processing services may store or process data on servers located outside Australia (including the United States). By using this website or making a purchase, you consent to this transfer. We take reasonable steps to ensure overseas recipients handle your information consistently with the Australian Privacy Principles.
          </p>
        </Section>

        <Section title="16. Changes to This Document">
          <p>
            We may update these Terms and Privacy Policy from time to time. The "Last updated" date at the top of this page will be revised accordingly. Continued use of the website or the Template after changes constitutes acceptance of the updated terms.
          </p>
        </Section>

        <Section title="17. Contact Us">
          <p>For any legal, privacy, or product support enquiries:</p>
          <div className="mt-4 rounded-xl p-5" style={{ background: BG2, border: `1px solid ${BORDER}` }}>
            <p className="font-semibold" style={{ color: HEAD }}>{SITE_NAME}</p>
            <p className="mt-1 text-sm" style={{ color: DIM }}>
              ABN: <span aria-label="Australian Business Number">54&nbsp;116&nbsp;010&nbsp;622</span>
            </p>
            <p className="mt-1 text-sm" style={{ color: DIM }}>
              Email: <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: GOLD }}>{CONTACT_EMAIL}</a>
            </p>
            <p className="mt-1 text-sm" style={{ color: DIM }}>Response time: within 30 days for privacy matters · within 7 days for product support</p>
          </div>
        </Section>

        {/* Footer nav */}
        <div className="mt-12 pt-8 flex flex-wrap gap-4 justify-center text-sm" style={{ borderTop: `1px solid ${BORDER}`, color: DIM, fontFamily: "'Outfit', sans-serif" }}>
          <Link href="/" style={{ color: GOLD, textDecoration: "none" }}>← Back to Home</Link>
          <span>·</span>
          <Link href="/pricing" style={{ color: GOLD, textDecoration: "none" }}>Pricing</Link>
          <span>·</span>
          <Link href="/scenarios" style={{ color: GOLD, textDecoration: "none" }}>Scenarios</Link>
          <span>·</span>
          <Link href="/demo" style={{ color: GOLD, textDecoration: "none" }}>Try Demo</Link>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold mb-4 pb-3" style={{ fontFamily: "'Cormorant Garamond', serif", color: HEAD, borderBottom: `1px solid ${BORDER}` }}>
        {title}
      </h2>
      <div className="text-sm leading-relaxed space-y-1" style={{ color: TEXT }}>
        {children}
      </div>
    </section>
  );
}
