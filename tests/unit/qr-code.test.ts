import { describe, it, expect } from "vitest";
import {
  buildWifiPayload,
  buildVCardPayload,
  buildEmailPayload,
  buildUpiPayload,
  generateQrDataUrl,
  generateQrSvgString,
} from "@/lib/calculations/qr-code";

describe("QR Code Payload Builders", () => {
  it("formats standard WPA WiFi credentials correctly", () => {
    const wifi = buildWifiPayload({
      ssid: "HomeFiber_5G",
      password: "pass;word:123",
      security: "WPA",
      hidden: false,
    });
    expect(wifi).toBe("WIFI:S:HomeFiber_5G;T:WPA;P:pass\\;word\\:123;;");
  });

  it("formats open/nopass WiFi networks correctly", () => {
    const wifi = buildWifiPayload({
      ssid: "CafeFreeWiFi",
      security: "nopass",
      hidden: true,
    });
    expect(wifi).toBe("WIFI:S:CafeFreeWiFi;T:nopass;H:true;;");
  });

  it("formats vCard 3.0 contacts correctly", () => {
    const vcard = buildVCardPayload({
      firstName: "Rahul",
      lastName: "Sharma",
      organization: "Acme Corp",
      jobTitle: "Senior Architect",
      phone: "+91 98765 43210",
      email: "rahul@example.com",
      website: "https://example.com",
    });

    expect(vcard).toContain("BEGIN:VCARD");
    expect(vcard).toContain("VERSION:3.0");
    expect(vcard).toContain("FN:Rahul Sharma");
    expect(vcard).toContain("ORG:Acme Corp");
    expect(vcard).toContain("TEL;TYPE=CELL:+91 98765 43210");
    expect(vcard).toContain("EMAIL;TYPE=WORK:rahul@example.com");
    expect(vcard).toContain("END:VCARD");
  });

  it("formats mailto email payloads correctly", () => {
    const email = buildEmailPayload({
      email: "support@pockettools.app",
      subject: "Feedback on QR Tool",
      body: "Hi Team, loved the tool!",
    });
    expect(email).toBe(
      "mailto:support@pockettools.app?subject=Feedback%20on%20QR%20Tool&body=Hi%20Team%2C%20loved%20the%20tool!"
    );
  });

  it("formats UPI payment links correctly", () => {
    const upi = buildUpiPayload({
      vpa: "merchant@upi",
      payeeName: "Pocket Tools Store",
      amount: "499",
      note: "Pro Subscription",
    });
    expect(upi).toContain("upi://pay?pa=merchant%40upi");
    expect(upi).toContain("pn=Pocket%20Tools%20Store");
    expect(upi).toContain("am=499");
    expect(upi).toContain("cu=INR");
  });

  it("generates valid PNG Data URLs and SVG strings", async () => {
    const png = await generateQrDataUrl("https://pockettools.app");
    expect(png).toMatch(/^data:image\/png;base64,/);

    const svg = await generateQrSvgString("https://pockettools.app");
    expect(svg).toContain("<svg");
    expect(svg).toContain("</svg>");
  });
});
