import type { Metadata } from "next";
import { ShieldCheck, Lock, EyeOff, ServerOff } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy — Pocket Tools",
  description:
    "Pocket Tools Privacy Policy: 100% client-side computing, zero data harvesting, zero tracking, zero password persistence.",
  alternates: {
    canonical: "https://pockettools.app/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-10">
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text">
          Privacy Policy
        </h1>
        <p className="text-xs text-text-muted">Last Updated: September 2026</p>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
          At <strong>Pocket Tools</strong>, privacy is not a checkbox—it is fundamental to how the application is built.
        </p>
      </div>

      <div className="space-y-8 text-sm text-text-secondary leading-relaxed">
        {/* Section 1 */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-text flex items-center gap-2">
            <ServerOff className="w-5 h-5 text-primary" />
            1. Zero Server-Side Processing
          </h2>
          <p>
            All calculations, unit conversions, financial formulas, and date math are executed 100% locally in your device’s web browser. No calculation inputs, figures, or dates are transmitted over any network or stored on external servers.
          </p>
        </div>

        {/* Section 2 */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-text flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-500" />
            2. Password & Sensitive Data Handling
          </h2>
          <p>
            The Password Generator relies on the browser’s native <code>crypto.getRandomValues</code> API. Generated passwords exist solely in volatile browser RAM and are <strong>never written to localStorage, indexedDB, cookies, or remote databases</strong>.
          </p>
        </div>

        {/* Section 3 */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-text flex items-center gap-2">
            <EyeOff className="w-5 h-5 text-amber-500" />
            3. Local Storage Usage
          </h2>
          <p>
            We use your browser’s local storage strictly for client-side user preferences:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Your chosen visual theme preference (Light, Dark, or System default).</li>
            <li>Your pinned tool favorites.</li>
            <li>A local list of your recent tools (up to 10 entries) for quick navigation.</li>
          </ul>
          <p>This preference data remains exclusively on your device.</p>
        </div>

        {/* Section 4 */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-text flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            4. No Tracking, Analytics or Cookies
          </h2>
          <p>
            We do not sell data, load third-party advertising cookies, or profile user identities. Pocket Tools can be used completely anonymously without requiring account creation or login.
          </p>
        </div>
      </div>
    </div>
  );
}
