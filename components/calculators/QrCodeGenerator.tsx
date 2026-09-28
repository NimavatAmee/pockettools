"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  QrMode,
  QrErrorCorrectionLevel,
  QrOptions,
  DEFAULT_QR_OPTIONS,
  WifiData,
  VCardData,
  EmailData,
  UpiData,
  buildWifiPayload,
  buildVCardPayload,
  buildEmailPayload,
  buildUpiPayload,
  generateQrDataUrl,
  generateQrSvgString,
} from "@/lib/calculations/qr-code";
import { soundEffects } from "@/lib/audio/soundEffects";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";
import { CopyButton } from "@/components/shared/CommonStates";
import { ShareButton } from "@/components/shared/ShareModal";
import {
  Link as LinkIcon,
  Wifi,
  Contact,
  FileText,
  Mail,
  CreditCard,
  Download,
  Copy,
  Check,
  Eye,
  EyeOff,
  Palette,
  Sparkles,
  SlidersHorizontal,
  RefreshCw,
} from "lucide-react";

const COLOR_PRESETS = [
  { name: "Classic Black", fg: "#000000", bg: "#ffffff" },
  { name: "Deep Indigo", fg: "#3b82f6", bg: "#ffffff" },
  { name: "Emerald Forest", fg: "#059669", bg: "#ffffff" },
  { name: "Crimson Rose", fg: "#e11d48", bg: "#ffffff" },
  { name: "Royal Violet", fg: "#7c3aed", bg: "#ffffff" },
  { name: "Dark Slate", fg: "#ffffff", bg: "#0f172a" },
];

export function QrCodeGenerator() {
  const [mode, setMode] = useState<QrMode>("url");

  // Form States
  const [urlInput, setUrlInput] = useState<string>("https://pockettools-seven.vercel.app");
  const [wifiData, setWifiData] = useState<WifiData>({
    ssid: "MyHome_WiFi",
    password: "",
    security: "WPA",
    hidden: false,
  });
  const [showWifiPassword, setShowWifiPassword] = useState<boolean>(false);

  const [vCardData, setVCardData] = useState<VCardData>({
    firstName: "Rahul",
    lastName: "Sharma",
    organization: "Pocket Tools",
    jobTitle: "Product Designer",
    phone: "+91 98765 43210",
    email: "rahul@pockettools-seven.vercel.app",
    website: "https://pockettools-seven.vercel.app",
    address: "",
    note: "",
  });

  const [textInput, setTextInput] = useState<string>("Scan this QR code with any smartphone camera!");
  const [emailData, setEmailData] = useState<EmailData>({
    email: "contact@pockettools-seven.vercel.app",
    subject: "Hello from Pocket Tools",
    body: "",
  });
  const [upiData, setUpiData] = useState<UpiData>({
    vpa: "merchant@upi",
    payeeName: "Pocket Tools Store",
    amount: "499",
    note: "Digital Purchase",
  });

  // Customization States
  const [options, setOptions] = useState<QrOptions>(DEFAULT_QR_OPTIONS);
  const [showCustomizer, setShowCustomizer] = useState<boolean>(false);

  // Output States
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [svgString, setSvgString] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Compute Active Payload
  const getPayload = useCallback((): string => {
    switch (mode) {
      case "url":
        return urlInput.trim() || "https://pockettools-seven.vercel.app";
      case "wifi":
        return buildWifiPayload(wifiData);
      case "vcard":
        return buildVCardPayload(vCardData);
      case "text":
        return textInput.trim() || "Pocket Tools";
      case "email":
        return buildEmailPayload(emailData);
      case "upi":
        return buildUpiPayload(upiData);
      default:
        return "https://pockettools-seven.vercel.app";
    }
  }, [mode, urlInput, wifiData, vCardData, textInput, emailData, upiData]);

  // Generate QR Code on changes
  useEffect(() => {
    let isMounted = true;
    const currentPayload = getPayload();

    const generate = async () => {
      setIsGenerating(true);
      try {
        const [dataUrl, svg] = await Promise.all([
          generateQrDataUrl(currentPayload, options),
          generateQrSvgString(currentPayload, options),
        ]);
        if (isMounted) {
          setQrDataUrl(dataUrl);
          setSvgString(svg);
        }
      } catch (err) {
        console.error("QR Generation error", err);
      } finally {
        if (isMounted) setIsGenerating(false);
      }
    };

    const timer = setTimeout(generate, 50);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [getPayload, options]);

  // Download Handlers
  const handleDownloadPng = (dimension: number = 1024) => {
    soundEffects.playClick();
    const payload = getPayload();
    generateQrDataUrl(payload, { ...options, width: dimension }).then((url) => {
      const link = document.createElement("a");
      link.download = `qrcode-${mode}-${dimension}px.png`;
      link.href = url;
      link.click();
    });
  };

  const handleDownloadSvg = () => {
    soundEffects.playClick();
    if (!svgString) return;
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `qrcode-${mode}-vector.svg`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyImage = async () => {
    soundEffects.playClick();
    try {
      if (!qrDataUrl) return;
      const res = await fetch(qrDataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          "image/png": blob,
        }),
      ]);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy image to clipboard", err);
    }
  };

  const currentPayload = getPayload();

  const shareSummaryText = `📱 Generated Custom QR Code (${mode.toUpperCase()})

Content Type: ${
    mode === "url"
      ? "Website Link"
      : mode === "wifi"
      ? `WiFi Network (${wifiData.ssid})`
      : mode === "vcard"
      ? `Digital Contact (${vCardData.firstName} ${vCardData.lastName})`
      : mode === "upi"
      ? `UPI Payment (₹${upiData.amount || "0"})`
      : "Plain Text / Message"
  }

Generate your own free high-resolution QR Codes with PNG & SVG vector export:
[URL]

100% private, client-side, and offline-ready QR Code Generator.`;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* 1. Mode Navigation Tabs */}
      <Card className="border-border shadow-sm">
        <div className="p-3 border-b border-border bg-surface-secondary/40 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex p-1 bg-surface rounded-btn border border-border gap-1 text-xs shrink-0">
            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                setMode("url");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
                mode === "url"
                  ? "bg-primary text-white shadow-sm"
                  : "text-text-secondary hover:text-text"
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>URL</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                setMode("wifi");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
                mode === "wifi"
                  ? "bg-primary text-white shadow-sm"
                  : "text-text-secondary hover:text-text"
              }`}
            >
              <Wifi className="w-3.5 h-3.5" />
              <span>WiFi</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                setMode("vcard");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
                mode === "vcard"
                  ? "bg-primary text-white shadow-sm"
                  : "text-text-secondary hover:text-text"
              }`}
            >
              <Contact className="w-3.5 h-3.5" />
              <span>Contact vCard</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                setMode("text");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
                mode === "text"
                  ? "bg-primary text-white shadow-sm"
                  : "text-text-secondary hover:text-text"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Text</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                setMode("email");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
                mode === "email"
                  ? "bg-primary text-white shadow-sm"
                  : "text-text-secondary hover:text-text"
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                setMode("upi");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
                mode === "upi"
                  ? "bg-primary text-white shadow-sm"
                  : "text-text-secondary hover:text-text"
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>UPI Pay</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCustomizer(!showCustomizer)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 h-8 text-xs font-semibold rounded-md border transition-all ${
                showCustomizer
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-surface border-border text-text-secondary hover:text-text hover:bg-surface-secondary"
              }`}
              title="Customize Colors & Error Correction"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Styling</span>
            </Button>
            <ShareButton title="QR Code Generator" summaryText={shareSummaryText} />
          </div>
        </div>

        {/* 2. Main Two-Column Work Area */}
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Input Form Controls (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              {/* URL Mode */}
              {mode === "url" && (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text uppercase tracking-wider">
                      Website URL / Destination Link
                    </label>
                    <Input
                      type="url"
                      placeholder="https://yourwebsite.com"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      className="font-mono text-sm"
                    />
                    <p className="text-[11px] text-text-muted">
                      Type or paste any webpage, social media profile, YouTube video, or document link.
                    </p>
                  </div>
                </div>
              )}

              {/* WiFi Mode */}
              {mode === "wifi" && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text uppercase tracking-wider">
                      Network Name (SSID)
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. HomeFiber_5G"
                      value={wifiData.ssid}
                      onChange={(e) => setWifiData({ ...wifiData, ssid: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-text uppercase tracking-wider">
                        Security Type
                      </label>
                      <select
                        value={wifiData.security}
                        onChange={(e) =>
                          setWifiData({
                            ...wifiData,
                            security: e.target.value as "WPA" | "WEP" | "nopass",
                          })
                        }
                        className="w-full px-3 py-2 text-sm rounded-btn bg-surface border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="WPA">WPA / WPA2 / WPA3 (Standard)</option>
                        <option value="WEP">WEP (Legacy)</option>
                        <option value="nopass">None (Open Network)</option>
                      </select>
                    </div>

                    {wifiData.security !== "nopass" && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-text uppercase tracking-wider">
                          WiFi Password
                        </label>
                        <div className="relative">
                          <Input
                            type={showWifiPassword ? "text" : "password"}
                            placeholder="Enter WiFi password"
                            value={wifiData.password || ""}
                            onChange={(e) => setWifiData({ ...wifiData, password: e.target.value })}
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowWifiPassword(!showWifiPassword)}
                            className="absolute right-3 top-2.5 text-text-muted hover:text-text"
                            title={showWifiPassword ? "Hide password" : "Show password"}
                          >
                            {showWifiPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <label className="flex items-center gap-2 text-xs text-text-secondary cursor-pointer">
                    <input
                      type="checkbox"
                      checked={wifiData.hidden || false}
                      onChange={(e) => setWifiData({ ...wifiData, hidden: e.target.checked })}
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                    <span>Hidden Network (SSID is not broadcasted)</span>
                  </label>
                </div>
              )}

              {/* Contact vCard Mode */}
              {mode === "vcard" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-text-secondary uppercase">
                        First Name
                      </label>
                      <Input
                        type="text"
                        placeholder="First name"
                        value={vCardData.firstName}
                        onChange={(e) => setVCardData({ ...vCardData, firstName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-text-secondary uppercase">
                        Last Name
                      </label>
                      <Input
                        type="text"
                        placeholder="Last name"
                        value={vCardData.lastName}
                        onChange={(e) => setVCardData({ ...vCardData, lastName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-text-secondary uppercase">
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={vCardData.phone || ""}
                        onChange={(e) => setVCardData({ ...vCardData, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-text-secondary uppercase">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        placeholder="name@company.com"
                        value={vCardData.email || ""}
                        onChange={(e) => setVCardData({ ...vCardData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-text-secondary uppercase">
                        Company / Org
                      </label>
                      <Input
                        type="text"
                        placeholder="Company Name"
                        value={vCardData.organization || ""}
                        onChange={(e) => setVCardData({ ...vCardData, organization: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-text-secondary uppercase">
                        Job Title
                      </label>
                      <Input
                        type="text"
                        placeholder="e.g. Marketing Lead"
                        value={vCardData.jobTitle || ""}
                        onChange={(e) => setVCardData({ ...vCardData, jobTitle: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-text-secondary uppercase">
                      Website / Portfolio Link
                    </label>
                    <Input
                      type="url"
                      placeholder="https://yourbrand.com"
                      value={vCardData.website || ""}
                      onChange={(e) => setVCardData({ ...vCardData, website: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* Text Mode */}
              {mode === "text" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text uppercase tracking-wider">
                    Plain Text Message or Notes
                  </label>
                  <textarea
                    rows={5}
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Enter any text, crypto wallet address, or serial code..."
                    className="w-full px-3 py-2 text-sm rounded-btn bg-surface border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none font-mono"
                  />
                  <div className="text-right text-[11px] text-text-muted">
                    {textInput.length} characters
                  </div>
                </div>
              )}

              {/* Email Mode */}
              {mode === "email" && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-text-secondary uppercase">
                      Recipient Email
                    </label>
                    <Input
                      type="email"
                      placeholder="recipient@example.com"
                      value={emailData.email}
                      onChange={(e) => setEmailData({ ...emailData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-text-secondary uppercase">
                      Subject Line (Optional)
                    </label>
                    <Input
                      type="text"
                      placeholder="Feedback / Inquiry"
                      value={emailData.subject || ""}
                      onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-text-secondary uppercase">
                      Default Message Body (Optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Pre-filled email body..."
                      value={emailData.body || ""}
                      onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-btn bg-surface border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                    />
                  </div>
                </div>
              )}

              {/* UPI Payment Mode */}
              {mode === "upi" && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-text-secondary uppercase">
                      UPI Virtual Payment Address (VPA)
                    </label>
                    <Input
                      type="text"
                      placeholder="username@okhdfcbank / yourname@upi"
                      value={upiData.vpa}
                      onChange={(e) => setUpiData({ ...upiData, vpa: e.target.value })}
                      className="font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-text-secondary uppercase">
                        Payee Name
                      </label>
                      <Input
                        type="text"
                        placeholder="Merchant / Name"
                        value={upiData.payeeName || ""}
                        onChange={(e) => setUpiData({ ...upiData, payeeName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-text-secondary uppercase">
                        Fixed Amount (₹ INR Optional)
                      </label>
                      <Input
                        type="number"
                        placeholder="e.g. 500"
                        value={upiData.amount || ""}
                        onChange={(e) => setUpiData({ ...upiData, amount: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-text-secondary uppercase">
                      Transaction Note (Optional)
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. Order #1042"
                      value={upiData.note || ""}
                      onChange={(e) => setUpiData({ ...upiData, note: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* Styling & Color Customizer Drawer */}
              {showCustomizer && (
                <div className="p-4 rounded-xl border border-border bg-surface-secondary/40 space-y-4 animate-in fade-in-50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-primary" />
                      <span>Color Palettes & Error Correction</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setOptions(DEFAULT_QR_OPTIONS)}
                      className="text-[11px] text-text-muted hover:text-primary flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                  </div>

                  {/* Preset Colors */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-text-secondary uppercase">
                      Preset Color Schemes
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {COLOR_PRESETS.map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() =>
                            setOptions({ ...options, foreground: preset.fg, background: preset.bg })
                          }
                          className={`flex items-center gap-2 p-1.5 rounded-lg border text-xs text-left transition-all ${
                            options.foreground === preset.fg && options.background === preset.bg
                              ? "border-primary bg-primary/10 font-semibold"
                              : "border-border bg-surface hover:border-text-secondary"
                          }`}
                        >
                          <span
                            className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                            style={{ backgroundColor: preset.fg }}
                          />
                          <span className="truncate">{preset.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Hex Pickers */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-text-secondary uppercase">
                        QR Pattern Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={options.foreground}
                          onChange={(e) => setOptions({ ...options, foreground: e.target.value })}
                          className="w-8 h-8 rounded border border-border cursor-pointer p-0 bg-transparent"
                        />
                        <Input
                          type="text"
                          value={options.foreground}
                          onChange={(e) => setOptions({ ...options, foreground: e.target.value })}
                          className="font-mono text-xs uppercase"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-text-secondary uppercase">
                        Background Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={options.background}
                          onChange={(e) => setOptions({ ...options, background: e.target.value })}
                          className="w-8 h-8 rounded border border-border cursor-pointer p-0 bg-transparent"
                        />
                        <Input
                          type="text"
                          value={options.background}
                          onChange={(e) => setOptions({ ...options, background: e.target.value })}
                          className="font-mono text-xs uppercase"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Error Correction & Margin */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-text-secondary uppercase">
                        Error Correction
                      </label>
                      <select
                        value={options.errorCorrectionLevel}
                        onChange={(e) =>
                          setOptions({
                            ...options,
                            errorCorrectionLevel: e.target.value as QrErrorCorrectionLevel,
                          })
                        }
                        className="w-full px-2.5 py-1.5 text-xs rounded-btn bg-surface border border-border text-text focus:outline-none"
                      >
                        <option value="L">Low (7% recovery)</option>
                        <option value="M">Medium (15% recovery)</option>
                        <option value="Q">Quartile (25% recovery)</option>
                        <option value="H">High (30% max recovery)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-text-secondary uppercase">
                        Quiet Zone Margin
                      </label>
                      <select
                        value={options.margin ?? 2}
                        onChange={(e) =>
                          setOptions({ ...options, margin: parseInt(e.target.value, 10) })
                        }
                        className="w-full px-2.5 py-1.5 text-xs rounded-btn bg-surface border border-border text-text focus:outline-none"
                      >
                        <option value="0">0 (No border)</option>
                        <option value="1">1 module</option>
                        <option value="2">2 modules (Standard)</option>
                        <option value="4">4 modules (Wide)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Live Preview & Downloads (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-4">
              <div className="relative p-6 rounded-2xl bg-surface border border-border shadow-md flex items-center justify-center group">
                {/* QR Code Canvas/Image Output */}
                {qrDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={qrDataUrl}
                    alt="Generated QR Code"
                    className="w-56 h-56 sm:w-64 sm:h-64 object-contain rounded-lg transition-transform group-hover:scale-105 duration-200"
                  />
                ) : (
                  <div className="w-56 h-56 flex items-center justify-center text-xs text-text-muted">
                    Generating QR Code...
                  </div>
                )}

                {isGenerating && (
                  <div className="absolute inset-0 bg-surface/60 backdrop-blur-[1px] flex items-center justify-center rounded-2xl">
                    <span className="text-xs font-semibold text-primary animate-pulse">Rendering...</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="w-full max-w-xs space-y-2">
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={() => handleDownloadPng(1024)}
                  className="w-full font-bold gap-2 py-5 shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PNG (HD)</span>
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadSvg}
                    className="w-full gap-1.5 text-xs font-semibold"
                    title="Download Scalable Vector Graphics for Printing"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <span>SVG (Vector)</span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCopyImage}
                    className="w-full gap-1.5 text-xs font-semibold"
                    title="Copy QR Code Image to Clipboard"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-500">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Image</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Payload Preview */}
              <div className="w-full max-w-xs p-2.5 rounded-lg bg-surface-secondary/50 border border-border text-[11px] text-text-muted space-y-1">
                <span className="font-semibold text-text-secondary block">Encoded String Payload:</span>
                <p className="font-mono break-all line-clamp-2 select-all">
                  {currentPayload}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
