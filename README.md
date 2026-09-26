# 🧰 Pocket Tools — All-in-One Utility App

> **Fast, simple, and free online tools for everyday calculations and utilities.**
> Next.js App Router • React • TypeScript (Strict Mode) • Tailwind CSS • shadcn/ui • Client-Side Execution

---

## 🚀 Features & Tools

| Category | Tool Name | Route | Description |
| :--- | :--- | :--- | :--- |
| **Finance** | **GST Calculator** | `/calculators/gst` | Inclusive & exclusive modes, 0–28% slabs + custom tax rates. |
| **Finance** | **EMI Calculator** | `/calculators/emi` | Monthly loan installments, total interest, zero-interest no-cost support. |
| **Finance** | **Discount Calculator** | `/calculators/discount` | Sale markdowns, original prices, savings amount, and net checkout price. |
| **Finance** | **Percentage Calculator** | `/calculators/percentage` | 3 calculation modes: $X\%$ of $Y$, $X$ as $\%$ of $Y$, percentage change. |
| **Finance** | **Tip Calculator** | `/calculators/tip` | Gratuity calculation and equal bill splitting among $N$ people. |
| **Math** | **Basic Calculator** | `/math/basic-calculator` | Arithmetic with memory, keyboard support, decimals, zero `eval()`. |
| **Health** | **BMI Calculator** | `/health/bmi` | Metric & Imperial BMI calculation, WHO category badges, health disclaimer. |
| **Date & Time** | **Age Calculator** | `/date-time/age` | Years, months, days breakdown, upcoming birthday countdown. |
| **Date & Time** | **Date Difference** | `/date-time/date-difference` | Elapsed days, weeks, months, working business days (Mon–Fri). |
| **Converters** | **Unit Converter** | `/converters/unit` | 7 physical & digital categories: Length, Weight, Temp (°C/°F/K), Area, Volume, Time, Data. |
| **Developer Tools** | **JSON Formatter** | `/developer-tools/json-formatter` | Beautify, minify, inspect syntax errors. 100% private, zero `eval()`. |
| **Developer Tools** | **Password Generator** | `/developer-tools/password-generator` | Cryptographically secure passwords using Web Crypto API CSPRNG. |

---

## 🎨 Design System

- **Primary Color:** `#5B5BF0`
- **Themes:** Light, Dark, and System default (zero-flash theme hydration via `next-themes`).
- **Responsive Layout:** Mobile (<640px), Tablet (640–1024px), Desktop (>1024px).
- **Number Formatting:** Default Indian grouping via `Intl.NumberFormat('en-IN')` (e.g. ₹1,00,000).

---

## 🛠️ Project Structure

```text
pocket-tools/
├── app/
│   ├── layout.tsx                # Root layout (ThemeProvider, Navbar, Footer)
│   ├── page.tsx                  # Interactive Homepage with search & categories
│   ├── globals.css               # Design system color variables
│   ├── not-found.tsx             # 404 handler
│   ├── sitemap.ts & robots.ts    # Dynamic SEO sitemap and crawling rules
│   ├── calculators/              # GST, EMI, Discount, Percentage, Tip, Directory
│   ├── math/                     # Basic Calculator
│   ├── health/                   # BMI Calculator
│   ├── date-time/                # Age & Date Difference
│   ├── converters/               # Unit Converter
│   ├── developer-tools/          # JSON Formatter & Password Generator
│   ├── about/                    # About Pocket Tools
│   └── privacy/                  # Privacy Policy
├── components/
│   ├── ui/                       # Reusable UI primitives (Button, Input, Card, Badge)
│   ├── layout/                   # Navbar & Footer
│   ├── shared/                   # CommonStates, ToolIcon
│   ├── tools/                    # ToolLayout standardized container
│   ├── home/                     # HomeClient interactive search & favorites
│   ├── calculators/              # 11 interactive calculator client components
│   └── theme/                    # ThemeProvider & ThemeToggle
├── lib/
│   ├── calculations/             # Pure math and calculation engines (100% unit tested)
│   ├── constants/                # Centralized typed tool registry & categories
│   └── formatters/               # Currency (₹), numbers, percentages, decimals
├── hooks/
│   └── useToolPreferences.ts     # Local storage favorites & recent tools manager
└── tests/
    └── unit/                     # Vitest test suites verifying smoke test cases
```

---

## 🧪 Testing & Verification

Run the test suite with Vitest:
```bash
npm test
```

Run TypeScript compilation check & linting:
```bash
npx tsc --noEmit
npm run lint
```

Build for production:
```bash
npm run build
```

---

## 🔒 Security & Privacy Guarantees

1. **Zero Server Computation:** All calculations run 100% locally in the browser runtime.
2. **Zero Password Persistence:** Generated passwords exist only in volatile client RAM.
3. **No `eval()` Usage:** Math evaluation and JSON processing use safe token parsing and native `JSON.parse()`.
4. **CSPRNG:** Passwords use hardware-entropy browser `crypto.getRandomValues()` instead of pseudo-random `Math.random()`.
