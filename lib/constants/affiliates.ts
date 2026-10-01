export interface AffiliateOffer {
  id: string;
  badge: string;
  title: string;
  description: string;
  ctaText: string;
  href: string; // Your affiliate/referral link
  sponsorName: string;
  logoIcon:
    | "TrendingUp"
    | "Landmark"
    | "ShieldCheck"
    | "Wallet"
    | "FileText"
    | "CreditCard"
    | "HeartPulse"
    | "Sparkles"
    | "Shield"
    | "Code"
    | "Clock"
    | "Coins"
    | "RefreshCw";
  toolSlugs: string[]; // Tool slugs where this offer should display
  commissionType?: string; // Internal reference
}

export const AFFILIATE_OFFERS: AffiliateOffer[] = [
  // 1. Wealth & Investments (SIP, Compound Interest, FD/RD)
  {
    id: "angelone-demat-sip",
    badge: "0% Brokerage • ₹0 Account Opening",
    title: "Start SIP & Invest in Direct Mutual Funds with Angel One",
    description: "Open a 100% free paperless Demat & Trading account in 5 minutes. Enjoy ₹0 brokerage on mutual funds, stocks, and IPO investments.",
    ctaText: "Open Free Angel One Account",
    href: "https://angel-one.onelink.me/Wjgr/63dxv9lf",
    sponsorName: "Angel One",
    logoIcon: "TrendingUp",
    toolSlugs: [
      "calculators/sip",
      "calculators/compound-interest",
      "calculators/fd-rd",
    ],
    commissionType: "Direct Angel One Referral / DRA",
  },

  // 2. Loans & Credit (EMI Calculator)
  {
    id: "bankbazaar-loans",
    badge: "Lowest Interest Rates",
    title: "Check Pre-Approved Loans up to ₹40 Lakh",
    description: "Compare Home & Personal Loan interest rates across 30+ top banks with instant paperless sanction and 0 pre-closure charges.",
    ctaText: "Check Free Loan Eligibility",
    href: "https://www.bankbazaar.com",
    sponsorName: "Banking Partner",
    logoIcon: "CreditCard",
    toolSlugs: [
      "calculators/emi",
    ],
    commissionType: "₹500 - ₹1,200 CPL (BankBazaar / Paisabazaar)",
  },

  // 3. Tax Filing & PF (Income Tax, EPF)
  {
    id: "cleartax-itr",
    badge: "Max Tax Refund Guaranteed",
    title: "File Your ITR in Under 3 Minutes",
    description: "Auto-fetch Form 16 from IT portal, maximize Section 80C/80D/HRA deductions, and get maximum tax refunds safely.",
    ctaText: "File Free Tax Return",
    href: "https://cleartax.in",
    sponsorName: "Tax Filing Partner",
    logoIcon: "FileText",
    toolSlugs: [
      "calculators/income-tax",
      "calculators/epf",
    ],
    commissionType: "₹150 - ₹400 CPA (ClearTax / Quicko)",
  },

  // 4. Business & Current Account (GST Calculator, Discount Calculator)
  {
    id: "business-banking",
    badge: "Zero Balance Current Account",
    title: "Smart Business Banking & Automated GST Invoicing",
    description: "Get instant UPI QR collections, automated GST invoices, and zero-fee corporate expense debit cards for your business.",
    ctaText: "Open Zero Balance Account",
    href: "https://razorpay.com/x",
    sponsorName: "Fintech Partner",
    logoIcon: "Landmark",
    toolSlugs: [
      "calculators/gst",
      "calculators/discount",
      "calculators/percentage",
    ],
    commissionType: "₹500 - ₹1,500 CPA",
  },

  // 5. Forex & Global Travel (Currency Converter)
  {
    id: "forex-card-offer",
    badge: "Zero Forex Markup",
    title: "Get Zero Forex Markup Card for Global Travel & Payments",
    description: "Spend globally at real interbank exchange rates without paying high 3.5% bank forex charges.",
    ctaText: "Get Free Global Card",
    href: "https://www.goniyo.com",
    sponsorName: "Forex Banking Partner",
    logoIcon: "Coins",
    toolSlugs: [
      "converters/currency",
    ],
    commissionType: "₹250 - ₹600 CPA",
  },

  // 6. Health & Wellness (BMI Calculator, Age Calculator)
  {
    id: "health-insurance-offer",
    badge: "₹1 Crore Health Cover",
    title: "Comprehensive Health & Term Insurance starting @ ₹490/mo",
    description: "Protect your family with 100% cashless hospitalization across 10,000+ top hospitals and save tax under Section 80D.",
    ctaText: "Compare Health Plans",
    href: "https://www.policybazaar.com",
    sponsorName: "Insurance Partner",
    logoIcon: "HeartPulse",
    toolSlugs: [
      "health/bmi",
      "date-time/age",
      "date-time/date-difference",
    ],
    commissionType: "₹800 - ₹2,000 CPA (PolicyBazaar)",
  },

  // 7. Developer & Cloud Tools (JSON Formatter, Password Generator, QR Code)
  {
    id: "developer-cloud-offer",
    badge: "Exclusive Developer Deal",
    title: "High-Speed NVMe Cloud Hosting with Free SSL & Domain",
    description: "Deploy Next.js apps, Node APIs, and static websites with 99.99% uptime, global CDN, and 24/7 developer support.",
    ctaText: "Claim 75% Off Hosting",
    href: "https://www.hostinger.com",
    sponsorName: "Cloud Infrastructure Partner",
    logoIcon: "Code",
    toolSlugs: [
      "developer-tools/json-formatter",
      "developer-tools/password-generator",
      "developer-tools/qr-code",
    ],
    commissionType: "$20 - $50 CPA (Hostinger / DigitalOcean)",
  },

  // 8. Productivity & Focus (Pomodoro, Basic Calculator, Unit Converter, Tip)
  {
    id: "productivity-suite-offer",
    badge: "Boost Productivity",
    title: "All-in-One AI Workspace for Notes, Tasks & Collaboration",
    description: "Organize your workflow, track personal projects, and stay focused with AI-powered notes and smart time-blocking.",
    ctaText: "Try Free AI Workspace",
    href: "https://www.notion.so",
    sponsorName: "Productivity Partner",
    logoIcon: "Sparkles",
    toolSlugs: [
      "date-time/pomodoro",
      "math/basic-calculator",
      "converters/unit",
      "calculators/tip",
    ],
    commissionType: "$5 - $15 CPA (Notion / Taskade)",
  },
];

export function getAffiliateOfferForTool(slug: string): AffiliateOffer | undefined {
  const normalized = slug.replace(/^\/+|\/+$/g, "");
  return AFFILIATE_OFFERS.find((offer) =>
    offer.toolSlugs.some((s) => s === normalized || s === slug)
  );
}
