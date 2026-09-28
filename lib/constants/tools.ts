import { CategoryInfo, Tool } from "@/types";

export const CATEGORIES: CategoryInfo[] = [
  {
    name: "Finance",
    slug: "finance",
    description: "Smart calculation tools for taxes, loans, savings, and discounts.",
    icon: "Wallet",
  },
  {
    name: "Math",
    slug: "math",
    description: "Reliable calculation tools for everyday math operations.",
    icon: "Calculator",
  },
  {
    name: "Health",
    slug: "health",
    description: "Body mass and wellness calculators for everyday health tracking.",
    icon: "Activity",
  },
  {
    name: "Date & Time",
    slug: "date-time",
    description: "Precise date differences, age calculations, and time counters.",
    icon: "Calendar",
  },
  {
    name: "Converters",
    slug: "converters",
    description: "Multi-unit converters for length, weight, temperature, and data.",
    icon: "RefreshCw",
  },
  {
    name: "Developer Tools",
    slug: "developer-tools",
    description: "Client-side developer utilities for code formatting and security.",
    icon: "Code",
  },
];

export const TOOLS: Tool[] = [
  // 1. GST Calculator
  {
    id: "gst-calculator",
    name: "GST Calculator",
    slug: "calculators/gst",
    category: "Finance",
    categorySlug: "finance",
    description: "Calculate Goods and Services Tax (GST) easily with inclusive and exclusive tax modes and preset slabs.",
    icon: "Receipt",
    keywords: ["gst", "tax", "finance", "cgst", "sgst", "igst", "inclusive", "exclusive", "goods and services tax"],
    featured: true,
    formula: {
      title: "GST Calculation Formulas",
      expression: "Exclusive GST: Tax = (Amount × Rate) / 100 | Total = Amount + Tax\nInclusive GST: Tax = Amount - [Amount / (1 + Rate / 100)] | Base = Amount - Tax",
      explanation: "For Exclusive GST, the tax amount is added onto the base price. For Inclusive GST, the gross price already contains the tax, so the base amount is reversed out.",
      steps: [
        "Choose Exclusive mode to add GST on top of an amount, or Inclusive mode to extract GST from the total amount.",
        "Enter the base or total amount in ₹.",
        "Select standard GST slab (0%, 5%, 12%, 18%, 28%) or type a custom tax percentage.",
        "View the instant breakdown: Base Amount, CGST, SGST / IGST, Total Tax, and Final Gross Amount."
      ],
    },
    examples: [
      {
        title: "Standard Service (18% Exclusive)",
        description: "Billing ₹1,000 for web design with standard 18% GST.",
        inputs: { "Amount": "₹1,000", "Rate": "18%", "Mode": "Exclusive" },
        result: { "Base Amount": "₹1,000", "GST Amount": "₹180", "Total Payable": "₹1,180" },
      },
      {
        title: "Retail Product (12% Inclusive)",
        description: "A retail item priced at ₹1,120 including 12% GST.",
        inputs: { "Amount": "₹1,120", "Rate": "12%", "Mode": "Inclusive" },
        result: { "Base Amount": "₹1,000", "GST Amount": "₹120", "Total Payable": "₹1,120" },
      },
    ],
    faqs: [
      {
        question: "What is the difference between GST Inclusive and Exclusive?",
        answer: "Exclusive means GST is added on top of the original item cost. Inclusive means the stated price already contains the GST tax amount.",
      },
      {
        question: "What are the common GST tax slabs in India?",
        answer: "The primary GST tax slabs in India are 0%, 5%, 12%, 18%, and 28%.",
      },
      {
        question: "How is GST split between CGST and SGST?",
        answer: "For intra-state transactions, the total GST is split equally: 50% CGST (Central GST) and 50% SGST (State GST).",
      },
    ],
  },

  // 2. EMI Calculator
  {
    id: "emi-calculator",
    name: "EMI Calculator",
    slug: "calculators/emi",
    category: "Finance",
    categorySlug: "finance",
    description: "Calculate monthly Equated Monthly Installments (EMI), total interest payable, and total loan cost.",
    icon: "Coins",
    keywords: ["emi", "loan", "home loan", "car loan", "interest", "principal", "mortgage", "monthly installment"],
    featured: true,
    formula: {
      title: "EMI Formula",
      expression: "EMI = [P × r × (1 + r)^n] / [(1 + r)^n - 1]",
      explanation: "Where P is the Principal Loan Amount, r is the monthly interest rate (Annual Rate / 12 / 100), and n is the loan tenure in months.",
      steps: [
        "Enter the principal loan amount in ₹.",
        "Enter the annual interest rate (%). Handles 0% interest for no-cost EMI.",
        "Choose loan tenure in either years or months.",
        "Get instant results for Monthly EMI, Total Interest Payable, and Overall Payment."
      ],
    },
    examples: [
      {
        title: "1-Year Personal Loan (12%)",
        description: "₹1,00,000 loan at 12% annual interest for 12 months.",
        inputs: { "Principal": "₹1,00,000", "Interest Rate": "12%", "Tenure": "12 Months" },
        result: { "Monthly EMI": "₹8,884.88", "Total Interest": "₹6,618.55", "Total Payment": "₹1,06,618.55" },
      },
      {
        title: "Zero-Interest / No-Cost EMI",
        description: "₹60,000 appliance purchased on 6 months no-cost EMI.",
        inputs: { "Principal": "₹60,000", "Interest Rate": "0%", "Tenure": "6 Months" },
        result: { "Monthly EMI": "₹10,000", "Total Interest": "₹0", "Total Payment": "₹60,000" },
      },
    ],
    faqs: [
      {
        question: "What is an EMI?",
        answer: "An Equated Monthly Installment (EMI) is a fixed payment amount made by a borrower to a lender at a specified date each calendar month.",
      },
      {
        question: "How is zero interest handled?",
        answer: "When the interest rate is 0%, the EMI is simply the Principal divided by the number of months (P / n).",
      },
      {
        question: "Does loan tenure in months or years make a difference?",
        answer: "No, 1 year is calculated as exactly 12 months, 5 years as 60 months, ensuring identical precision.",
      },
    ],
  },

  // 3. Discount Calculator
  {
    id: "discount-calculator",
    name: "Discount Calculator",
    slug: "calculators/discount",
    category: "Finance",
    categorySlug: "finance",
    description: "Calculate sale savings, markdown percentage, and final price after discounts.",
    icon: "Tag",
    keywords: ["discount", "sale", "shopping", "savings", "off", "markdown", "price cut"],
    featured: true,
    formula: {
      title: "Discount Calculation Formula",
      expression: "Savings = Original Price × (Discount % / 100)\nFinal Price = Original Price - Savings",
      explanation: "Calculates the total savings amount deducted from the original price to yield the final net payable amount.",
      steps: [
        "Enter the original price of the item in ₹.",
        "Enter the discount percentage or choose standard discount presets (10%, 20%, 30%, 50%).",
        "View total money saved and final discounted checkout price."
      ],
    },
    examples: [
      {
        title: "20% Off Fashion Sale",
        description: "₹1,000 jacket with 20% promotional discount.",
        inputs: { "Original Price": "₹1,000", "Discount": "20%" },
        result: { "You Save": "₹200", "Final Price": "₹800" },
      },
    ],
    faqs: [
      {
        question: "Can I enter a custom discount percentage?",
        answer: "Yes, you can enter any percentage between 0% and 100%.",
      },
      {
        question: "What if the discount is 100%?",
        answer: "The item is completely free: Savings equals the original price, and Final Price is ₹0.",
      },
    ],
  },

  // 4. Percentage Calculator
  {
    id: "percentage-calculator",
    name: "Percentage Calculator",
    slug: "calculators/percentage",
    category: "Finance",
    categorySlug: "finance",
    description: "Calculate what is X% of Y, X is what percent of Y, and percentage increase or decrease.",
    icon: "Percent",
    keywords: ["percent", "percentage", "math", "increase", "decrease", "ratio", "proportion", "growth"],
    featured: false,
    formula: {
      title: "Percentage Formulas",
      expression: "Mode 1: (X / 100) × Y\nMode 2: (X / Y) × 100\nMode 3: ((Y - X) / X) × 100",
      explanation: "Covers standard percentage calculations, proportional percentage comparisons, and relative growth/decay rates.",
      steps: [
        "Select the mode that matches your question.",
        "Input the two numeric values.",
        "Get instant computed result."
      ],
    },
    examples: [
      {
        title: "20% of 500",
        description: "Finding 20 percent of a total value of 500.",
        inputs: { "Percentage (X)": "20%", "Value (Y)": "500" },
        result: { "Calculated Result": "100" },
      },
    ],
    faqs: [
      {
        question: "How do I calculate percentage increase or decrease?",
        answer: "Subtract the original value from the new value, divide by the absolute original value, and multiply by 100.",
      },
      {
        question: "What happens if Y is 0?",
        answer: "Division by zero is safely handled, returning 0% and displaying an informative helper note.",
      },
    ],
  },

  // 5. Tip Calculator
  {
    id: "tip-calculator",
    name: "Tip Calculator",
    slug: "calculators/tip",
    category: "Finance",
    categorySlug: "finance",
    description: "Calculate tip amounts, total bill, and split payments evenly across any party size.",
    icon: "Utensils",
    keywords: ["tip", "bill split", "restaurant", "dining", "gratuity", "split bill", "friends"],
    featured: false,
    formula: {
      title: "Tip & Split Formula",
      expression: "Tip Amount = Bill × (Tip % / 100)\nTotal Bill = Bill + Tip Amount\nPer Person Share = Total Bill / Number of People",
      explanation: "Calculates the total gratuity based on the bill subtotal and divides total expenses equally among all diners.",
      steps: [
        "Enter the base bill amount.",
        "Select tip preset (5%, 10%, 15%, 20%) or enter a custom tip %.",
        "Enter number of people splitting the bill (default 1).",
        "Review Tip Amount, Total Bill, and each person's exact share."
      ],
    },
    examples: [
      {
        title: "Dinner for Two (10% Tip)",
        description: "₹1,000 bill with 10% tip split between 2 people.",
        inputs: { "Bill": "₹1,000", "Tip": "10%", "People": "2" },
        result: { "Tip Amount": "₹100", "Total Bill": "₹1,100", "Per Person": "₹550" },
      },
    ],
    faqs: [
      {
        question: "Can I use this without tipping?",
        answer: "Yes, simply set tip to 0% to split a flat bill evenly among party members.",
      },
      {
        question: "Can I enter more than 10 people?",
        answer: "Yes, any party size of 1 or more people is supported.",
      },
    ],
  },

  // 6. Basic Calculator
  {
    id: "basic-calculator",
    name: "Basic Calculator",
    slug: "math/basic-calculator",
    category: "Math",
    categorySlug: "math",
    description: "Fast, keyboard-friendly standard arithmetic calculator with memory, decimals, and zero-eval safety.",
    icon: "Calculator",
    keywords: ["calculator", "math", "add", "subtract", "multiply", "divide", "arithmetic", "percentage"],
    featured: true,
    formula: {
      title: "Arithmetic Operations",
      expression: "Addition (+), Subtraction (−), Multiplication (×), Division (÷), Percent (%)",
      explanation: "Evaluates standard arithmetic expressions safely using pure token-based math logic without using JavaScript eval().",
      steps: [
        "Click the on-screen keypad or use your physical keyboard numpad.",
        "Press numbers and arithmetic operators (+, −, ×, ÷).",
        "Press '=' or Enter to evaluate, 'C' to clear, or backspace (⌫) to delete digits.",
        "Division by zero displays a graceful error message without crashing."
      ],
    },
    examples: [
      {
        title: "Compound Calculation",
        description: "125 + 75 × 2 = 275",
        inputs: { "Expression": "125 + 75 * 2" },
        result: { "Result": "275" },
      },
    ],
    faqs: [
      {
        question: "Can I use my physical computer keyboard?",
        answer: "Yes! Full keyboard support is included: Numbers 0-9, +, -, *, /, Enter (=), Backspace, and Escape (Clear).",
      },
      {
        question: "Does it support decimals?",
        answer: "Yes, press '.' to add decimal points.",
      },
    ],
  },

  // 7. BMI Calculator
  {
    id: "bmi-calculator",
    name: "BMI Calculator",
    slug: "health/bmi",
    category: "Health",
    categorySlug: "health",
    description: "Calculate your Body Mass Index (BMI) using metric (kg/cm) or imperial (lb/ft-in) units with category classification.",
    icon: "HeartPulse",
    keywords: ["bmi", "body mass index", "health", "weight", "height", "underweight", "normal", "overweight", "obese"],
    featured: true,
    formula: {
      title: "Body Mass Index (BMI) Formula",
      expression: "Metric: BMI = Weight (kg) / [Height (m)]²\nImperial: BMI = 703 × Weight (lb) / [Height (in)]²",
      explanation: "BMI is a screening metric that classifies body mass based on height and weight into standard WHO health categories.",
      steps: [
        "Select your preferred measurement units (Metric: kg/cm or Imperial: lbs/ft-in).",
        "Enter your height and weight.",
        "View your calculated BMI score, health category classification (Underweight, Normal, Overweight, Obese), and healthy weight range.",
        "Read the health disclaimer (BMI is a screening tool, not medical advice)."
      ],
    },
    examples: [
      {
        title: "Metric Measurement (70kg, 175cm)",
        description: "70 kg weight with 175 cm height.",
        inputs: { "Weight": "70 kg", "Height": "175 cm" },
        result: { "BMI": "22.86", "Category": "Normal weight" },
      },
    ],
    faqs: [
      {
        question: "What are the BMI category thresholds?",
        answer: "Underweight: < 18.5 | Normal weight: 18.5 – 24.9 | Overweight: 25.0 – 29.9 | Obese: ≥ 30.0.",
      },
      {
        question: "Is BMI an accurate measure of body fat?",
        answer: "BMI is a useful general screening metric, but does not distinguish between muscle mass and fat mass. Consult a qualified doctor for personalized medical assessments.",
      },
    ],
  },

  // 8. Age Calculator
  {
    id: "age-calculator",
    name: "Age Calculator",
    slug: "date-time/age",
    category: "Date & Time",
    categorySlug: "date-time",
    description: "Calculate your exact age in years, months, days, hours, and minutes with upcoming birthday countdown.",
    icon: "CalendarDays",
    keywords: ["age", "birthday", "birth date", "how old am i", "years", "months", "days", "date of birth"],
    featured: false,
    formula: {
      title: "Age Calculation Method",
      expression: "Age = Target Date - Date of Birth (accounting for leap years and varied month lengths)",
      explanation: "Computes the exact calendar difference between the date of birth and the reference date, with validation rejecting future dates.",
      steps: [
        "Select your Date of Birth.",
        "Select the 'As of Date' (defaults to today's date).",
        "Get your age broken down precisely into Years, Months, and Days.",
        "See extra metrics: total days lived and days remaining until your next birthday."
      ],
    },
    examples: [
      {
        title: "Exact Age Breakdown",
        description: "Date of birth: 15 Jan 1995 evaluated today.",
        inputs: { "DOB": "1995-01-15", "As of": "Current Date" },
        result: { "Age": "Years, Months, Days breakdown" },
      },
    ],
    faqs: [
      {
        question: "What happens if I enter a future date of birth?",
        answer: "The calculator validates inputs and displays a friendly error message: 'Date of birth cannot be in the future'.",
      },
      {
        question: "Does this handle leap years?",
        answer: "Yes, all calendar calculations respect February leap years (29 days) and varying month durations.",
      },
    ],
  },

  // 9. Date Difference Calculator
  {
    id: "date-difference",
    name: "Date Difference",
    slug: "date-time/date-difference",
    category: "Date & Time",
    categorySlug: "date-time",
    description: "Find the exact duration, total elapsed days, weeks, months, and weekdays between two dates.",
    icon: "Clock",
    keywords: ["date difference", "days between dates", "duration", "calendar", "time span", "elapsed days", "weeks"],
    featured: false,
    formula: {
      title: "Date Difference Formula",
      expression: "Elapsed Days = (End Date (ms) - Start Date (ms)) / (1000 × 60 × 60 × 24)",
      explanation: "Calculates total calendar days and breaks them down into years, months, days, weeks, and working weekdays.",
      steps: [
        "Pick a Start Date and an End Date.",
        "Check whether you want to include the end date in the total count.",
        "View total days elapsed, week count, and calendar year/month/day breakdown."
      ],
    },
    examples: [
      {
        title: "Full Month of January 2026",
        description: "Span from 2026-01-01 to 2026-01-31.",
        inputs: { "Start Date": "2026-01-01", "End Date": "2026-01-31" },
        result: { "Elapsed Days": "30 days (or 31 inclusive)", "Duration": "4 weeks and 2 days" },
      },
    ],
    faqs: [
      {
        question: "Can I swap the start and end dates?",
        answer: "Yes, the tool automatically calculates the absolute duration regardless of which date is entered first.",
      },
      {
        question: "Can I count working days only?",
        answer: "Yes, the tool calculates both total calendar days and business days (Monday through Friday).",
      },
    ],
  },

  // 10. Unit Converter
  {
    id: "unit-converter",
    name: "Unit Converter",
    slug: "converters/unit",
    category: "Converters",
    categorySlug: "converters",
    description: "Convert units across 7 major categories: Length, Weight, Temperature, Area, Volume, Time, and Digital Data.",
    icon: "ArrowLeftRight",
    keywords: ["unit converter", "convert", "length", "weight", "temperature", "celsius to fahrenheit", "area", "volume", "data", "bytes"],
    featured: true,
    formula: {
      title: "Unit Conversion Principles",
      expression: "Temperature: °F = (°C × 9/5) + 32 | °C = (°F - 32) × 5/9 | K = °C + 273.15\nGeneral: Target Value = (Source Value × Source Ratio) / Target Ratio",
      explanation: "Linear physical quantities convert via normalized base units (meters, kilograms, bytes), while temperature uses specific algebraic transformation formulas.",
      steps: [
        "Select your measurement category (e.g. Length, Weight, Temperature, Data).",
        "Choose the 'From' unit and 'To' unit.",
        "Enter the value to convert.",
        "Instantly see the converted value, formula explanation, and quick multi-unit conversion matrix."
      ],
    },
    examples: [
      {
        title: "Freezing Point of Water",
        description: "Converting 0°C into Fahrenheit.",
        inputs: { "Category": "Temperature", "From": "0 °C", "To": "°F" },
        result: { "Result": "32 °F" },
      },
      {
        title: "Kilometers to Miles",
        description: "Converting 10 km into miles.",
        inputs: { "Category": "Length", "From": "10 km", "To": "Miles" },
        result: { "Result": "6.21371 Miles" },
      },
    ],
    faqs: [
      {
        question: "Which categories are supported in V1?",
        answer: "Length, Weight/Mass, Temperature, Area, Volume, Time, and Digital Storage Data.",
      },
      {
        question: "Does this require an internet connection?",
        answer: "No, all conversion formulas and base ratios run 100% locally in your browser with zero latency.",
      },
    ],
  },

  // 11. JSON Formatter
  {
    id: "json-formatter",
    name: "JSON Formatter",
    slug: "developer-tools/json-formatter",
    category: "Developer Tools",
    categorySlug: "developer-tools",
    description: "Format, beautify, validate, minify, and inspect JSON with syntax error detection. Safe and client-side.",
    icon: "FileJson",
    keywords: ["json", "formatter", "beautifier", "minify", "validate", "parser", "developer tools", "lint json"],
    featured: false,
    formula: {
      title: "JSON Specification",
      expression: "JSON.stringify(JSON.parse(input), null, 2)",
      explanation: "Validates JSON structure according to RFC 8259 specifications without using eval() or sending payloads to any server.",
      steps: [
        "Paste or type your raw JSON string into the editor.",
        "Click 'Format / Beautify' for clean 2-space indentation or 'Minify' for a compact single line.",
        "View detailed syntax error diagnostics if parsing fails.",
        "Use 'Copy JSON' to quickly copy the formatted result to your clipboard."
      ],
    },
    examples: [
      {
        title: "Minified to Pretty JSON",
        description: "Beautifying a single-line API response.",
        inputs: { "Input": "{\"id\":1,\"name\":\"Pocket Tools\"}" },
        result: { "Formatted": "{\n  \"id\": 1,\n  \"name\": \"Pocket Tools\"\n}" },
      },
    ],
    faqs: [
      {
        question: "Is my JSON safe and private?",
        answer: "Yes! All processing happens 100% locally inside your browser's JavaScript runtime. Your data is never uploaded to any server.",
      },
      {
        question: "Does this use eval()?",
        answer: "No. It uses native, safe JSON.parse() and JSON.stringify(), completely avoiding dangerous eval() execution.",
      },
    ],
  },

  // 12. Password Generator
  {
    id: "password-generator",
    name: "Password Generator",
    slug: "developer-tools/password-generator",
    category: "Developer Tools",
    categorySlug: "developer-tools",
    description: "Generate strong, secure, randomized passwords using cryptographically secure browser randomness (Web Crypto API).",
    icon: "KeyRound",
    keywords: ["password generator", "strong password", "security", "random password", "crypto", "safe password", "credentials"],
    featured: true,
    formula: {
      title: "Cryptographic Randomness",
      expression: "window.crypto.getRandomValues(new Uint32Array(length))",
      explanation: "Uses the browser's native Web Crypto API CSPRNG (Cryptographically Secure Pseudo-Random Number Generator) rather than insecure Math.random(). Generated passwords are never saved.",
      steps: [
        "Choose password length (from 6 to 64 characters).",
        "Toggle character sets: Uppercase (A-Z), Lowercase (a-z), Numbers (0-9), and Symbols (!@#$%^&*).",
        "Click 'Generate Password' or adjust sliders for instant new passwords.",
        "Check password strength indicator (Weak, Fair, Strong, Very Strong) and copy with one click."
      ],
    },
    examples: [
      {
        title: "16-Character High Security",
        description: "16 chars with uppercase, lowercase, numbers, and symbols.",
        inputs: { "Length": "16", "Options": "Upper + Lower + Numbers + Symbols" },
        result: { "Strength": "Very Strong (128-bit entropy)" },
      },
    ],
    faqs: [
      {
        question: "Are generated passwords saved in my browser or database?",
        answer: "No. Generated passwords are never stored in localStorage, cookies, or sent to any server. When you refresh or leave, they are gone.",
      },
      {
        question: "Why is Web Crypto API safer than standard Math.random()?",
        answer: "Math.random() is predictable and not cryptographically secure. The Web Crypto API uses hardware-level OS entropy to generate truly unpredictable random bytes.",
      },
    ],
  },

  // 13. SIP Calculator
  {
    id: "sip-calculator",
    name: "SIP Calculator",
    slug: "calculators/sip",
    category: "Finance",
    categorySlug: "finance",
    description: "Calculate mutual fund SIP and Lumpsum returns with interactive wealth growth charts and Step-Up annual top-ups.",
    icon: "TrendingUp",
    keywords: ["sip", "mutual fund", "investment", "lumpsum", "wealth", "returns", "compound", "step up sip", "cagr"],
    featured: true,
    formula: {
      title: "SIP Future Value Formula",
      expression: "M = P × [(1 + i)^n - 1] / i × (1 + i)",
      explanation: "Where P is the monthly investment amount, i is periodic monthly return rate (r / 12 / 100), and n is total months (years × 12).",
      steps: [
        "Select investment mode: Monthly SIP or One-time Lumpsum.",
        "Enter monthly investment or lumpsum principal amount in ₹.",
        "Enter expected annual return rate (%) and time duration in years.",
        "Optionally set an Annual Step-Up percentage to simulate salary increments.",
        "View instant wealth breakdown, interactive SVG growth graph, and year-by-year corpus progression."
      ],
    },
    examples: [
      {
        title: "₹5,000 Monthly SIP for 10 Years @ 12%",
        description: "Standard long-term equity mutual fund SIP.",
        inputs: { "Monthly SIP": "₹5,000", "Expected Rate": "12%", "Tenure": "10 Years" },
        result: { "Invested": "₹6,00,000", "Est. Returns": "₹5,61,695", "Total Corpus": "₹11,61,695" },
      },
    ],
    faqs: [
      {
        question: "What is the difference between SIP and Lumpsum?",
        answer: "SIP allows investing a fixed amount at regular monthly intervals, benefiting from rupee-cost averaging. Lumpsum is investing the entire principal amount in one go.",
      },
      {
        question: "What is a Step-Up SIP?",
        answer: "Step-Up SIP automatically increases your monthly contribution by a fixed percentage (e.g. 10%) every year as your income grows.",
      },
    ],
  },

  // 14. Compound Interest Calculator
  {
    id: "compound-interest-calculator",
    name: "Compound Interest Calculator",
    slug: "calculators/compound-interest",
    category: "Finance",
    categorySlug: "finance",
    description: "Calculate daily, monthly, quarterly, and yearly compound interest with periodic contributions and Simple vs Compound Interest comparisons.",
    icon: "Coins",
    keywords: ["compound interest", "interest", "compounding", "savings", "apy", "power of compounding", "future value", "daily compounding"],
    featured: true,
    formula: {
      title: "Compound Interest Formula",
      expression: "A = P(1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) - 1) / (r/n)]",
      explanation: "Where P is principal, r is annual rate in decimal, n is compounding frequency per year, t is years, and PMT is periodic addition.",
      steps: [
        "Enter your initial principal deposit in ₹.",
        "Enter the annual interest rate (%) and investment duration in years.",
        "Select compounding frequency (Daily, Monthly, Quarterly, Semi-Annually, or Annually).",
        "Optionally add regular monthly or annual deposit contributions.",
        "See your total accumulated interest and compare directly against simple interest."
      ],
    },
    examples: [
      {
        title: "₹1,00,000 @ 8% for 5 Years (Quarterly Compounding)",
        description: "Fixed deposit style compounding.",
        inputs: { "Principal": "₹1,00,000", "Rate": "8%", "Tenure": "5 Years", "Compounding": "Quarterly" },
        result: { "Final Balance": "₹1,48,595", "Total Interest": "₹48,595", "Compounding Gain": "₹8,595 extra vs SI" },
      },
    ],
    faqs: [
      {
        question: "Why does compounding frequency matter?",
        answer: "The more frequently interest is compounded (e.g. daily or monthly vs yearly), the faster your wealth grows because interest begins earning interest sooner.",
      },
    ],
  },

  // 15. Income Tax Calculator
  {
    id: "income-tax-calculator",
    name: "Income Tax Calculator",
    slug: "calculators/income-tax",
    category: "Finance",
    categorySlug: "finance",
    description: "Compare Old vs New Tax Regime side-by-side for FY 2024-25 & FY 2025-26 with Standard Deduction (₹75,000) and 87A rebate.",
    icon: "Receipt",
    keywords: ["income tax", "tax calculator", "old vs new tax regime", "budget 2024", "section 87a", "standard deduction", "80c", "80d", "hra tax"],
    featured: true,
    formula: {
      title: "Indian Income Tax Calculation (FY 2024-25 / 2025-26)",
      expression: "Total Tax = (Base Slab Tax - Section 87A Rebate) + 4% Health & Education Cess",
      explanation: "New Regime provides ₹75,000 standard deduction for salaried and ₹0 tax up to ₹7.75 Lakhs taxable income under Section 87A rebate.",
      steps: [
        "Enter your annual gross salary and any other additional income.",
        "Select your age category (General <60, Senior 60-80, Super Senior 80+).",
        "Enter eligible Old Regime deductions: Section 80C, 80D Health Insurance, HRA, Home Loan Interest 24(b), and NPS 80CCD(1B).",
        "Review the instant side-by-side comparison table and see which regime saves you more money."
      ],
    },
    examples: [
      {
        title: "₹7,75,000 Salaried Income (New Regime)",
        description: "Salaried employee with no extra deductions.",
        inputs: { "Salary": "₹7,75,000", "Regime": "New Regime" },
        result: { "Standard Deduction": "₹75,000", "Net Taxable": "₹7,00,000", "Total Tax": "₹0 (100% 87A Rebate)" },
      },
    ],
    faqs: [
      {
        question: "Is income up to ₹7.75 Lakh completely tax-free for salaried in New Regime?",
        answer: "Yes! With the ₹75,000 standard deduction, your net taxable income becomes ₹7,00,000, which gets 100% rebate under Section 87A, making total tax payable ₹0.",
      },
      {
        question: "When is Old Tax Regime better than New Tax Regime?",
        answer: "Old Regime is typically beneficial if your total eligible deductions (80C, 80D, HRA, Home loan interest) exceed ₹3.75 Lakh to ₹4 Lakh per year.",
      },
    ],
  },

  // 16. FD & RD Calculator
  {
    id: "fd-rd-calculator",
    name: "FD & RD Calculator",
    slug: "calculators/fd-rd",
    category: "Finance",
    categorySlug: "finance",
    description: "Calculate Fixed Deposit (FD) and Recurring Deposit (RD) maturity amounts with Indian banking quarterly compounding and Senior Citizen rates.",
    icon: "PiggyBank",
    keywords: ["fd", "rd", "fixed deposit", "recurring deposit", "bank interest", "senior citizen fd", "tds", "post office rd"],
    featured: true,
    formula: {
      title: "Bank FD & RD Compounding Formulas",
      expression: "FD: A = P(1 + r/400)^(4t) | RD: Sum of monthly quarterly compounded installments",
      explanation: "Indian banks compound interest quarterly on term deposits. Senior citizens receive an additional 0.50% interest rate boost.",
      steps: [
        "Choose Fixed Deposit (Lumpsum) or Recurring Deposit (Monthly).",
        "Enter your deposit amount and bank interest rate (%).",
        "Select duration (Years, Months, and Days).",
        "Toggle Senior Citizen (+0.50%) if applicable.",
        "Check total maturity amount, interest gained, and Section 194A TDS threshold alert."
      ],
    },
    examples: [
      {
        title: "1-Year Bank FD (₹1,00,000 @ 7%)",
        description: "Standard bank fixed deposit with quarterly compounding.",
        inputs: { "Deposit": "₹1,00,000", "Rate": "7%", "Tenure": "1 Year" },
        result: { "Maturity Amount": "₹1,07,186", "Interest Earned": "₹7,186" },
      },
    ],
    faqs: [
      {
        question: "What is the TDS threshold on FD/RD interest?",
        answer: "Under Section 194A, TDS is deducted if total annual bank interest exceeds ₹40,000 for regular individuals or ₹50,000 for senior citizens.",
      },
    ],
  },

  // 17. Live Currency Converter
  {
    id: "currency-converter",
    name: "Currency Converter",
    slug: "converters/currency",
    category: "Converters",
    categorySlug: "converters",
    description: "Convert 160+ world currencies with live exchange rates, country flags, instant search, and offline-first cache support.",
    icon: "DollarSign",
    keywords: ["currency converter", "forex", "exchange rate", "usd to inr", "eur to inr", "dollar", "rupee", "pound", "dirham", "travel money"],
    featured: true,
    formula: {
      title: "Currency Exchange Calculation",
      expression: "Converted Amount = Amount × (To Currency Rate / From Currency Rate)",
      explanation: "Converts values dynamically using real-time foreign exchange base ratios with automatic offline cache fallback.",
      steps: [
        "Enter the currency amount to convert.",
        "Select the 'From' currency and 'To' currency from the searchable list with country flags.",
        "Click the Swap button (⇄) to invert currencies instantly.",
        "View the converted value, live exchange rate, and popular currency comparison matrix."
      ],
    },
    examples: [
      {
        title: "$100 USD to INR",
        description: "Converting US Dollars into Indian Rupees.",
        inputs: { "Amount": "$100", "From": "USD", "To": "INR" },
        result: { "Converted Amount": "₹8,350.00", "Exchange Rate": "1 USD = 83.50 INR" },
      },
    ],
    faqs: [
      {
        question: "Does this currency converter work offline?",
        answer: "Yes! Rates are stored in your browser's local cache so you can continue converting even during network drops or while traveling.",
      },
    ],
  },

  // 18. Pomodoro Focus Timer
  {
    id: "pomodoro-timer",
    name: "Pomodoro Focus Timer",
    slug: "date-time/pomodoro",
    category: "Date & Time",
    categorySlug: "date-time",
    description: "Boost productivity with Pomodoro intervals (25m Focus / 5m Break), live browser tab countdown, audio chimes, and desktop notifications.",
    icon: "Timer",
    keywords: ["pomodoro", "timer", "focus", "productivity", "study timer", "work timer", "countdown", "break timer", "tab notification"],
    featured: true,
    formula: {
      title: "The Pomodoro Technique Workflow",
      expression: "25 min Focus + 5 min Short Break (Repeat 4x) → 15–20 min Long Break",
      explanation: "A scientifically proven time-management technique designed by Francesco Cirillo to eliminate fatigue, prevent burnout, and maximize daily deep-work output.",
      steps: [
        "Select an intentional task to work on.",
        "Start the 25-minute Focus timer and eliminate all distractions.",
        "Work until the gentle bell chime and browser tab alert notify you.",
        "Take a rejuvenating 5-minute Short Break.",
        "After every 4 completed Pomodoros, enjoy an extended 15-minute Long Break."
      ],
    },
    examples: [
      {
        title: "Standard Pomodoro Cycle",
        description: "25 minutes of deep focus followed by a 5-minute coffee break.",
        inputs: { "Focus Time": "25 mins", "Break Time": "5 mins", "Long Break": "15 mins" },
        result: { "Daily Goal": "4 to 8 Pomodoros", "Output": "100–200 minutes of undistracted flow" },
      },
    ],
    faqs: [
      {
        question: "How do tab notifications work?",
        answer: "The timer updates the browser tab title in real-time (e.g. '(24:15) 🧠 Focus | Pocket Tools'), so you can track remaining time even when browsing other tabs.",
      },
      {
        question: "Does the timer work if I switch tabs or minimize my window?",
        answer: "Yes! The timer is powered by drift-free timestamp calculation and triggers native desktop popup notifications and audio chimes when your focus session ends.",
      },
      {
        question: "Are my completed Pomodoro stats saved?",
        answer: "Yes, your daily completed focus sessions and time totals are securely preserved in your browser's local storage.",
      },
    ],
  },
  // 19. QR Code Generator
  {
    id: "qr-code-generator",
    name: "QR Code Generator",
    slug: "developer-tools/qr-code",
    category: "Developer Tools",
    categorySlug: "developer-tools",
    description: "Generate customized, high-resolution QR codes for WiFi networks, URLs, vCard digital contacts, text, email, and UPI with PNG & SVG vector download. 100% private.",
    icon: "QrCode",
    keywords: [
      "qr code",
      "qr generator",
      "wifi qr code",
      "vcard qr",
      "contact qr",
      "upi qr",
      "url qr",
      "png qr",
      "svg qr",
      "barcode"
    ],
    featured: true,
    formula: {
      title: "QR Code Matrix Specifications & Protocols",
      expression: "WiFi: WIFI:S:<SSID>;T:<WPA|WEP|nopass>;P:<Password>;;\nvCard 3.0: BEGIN:VCARD\\nVERSION:3.0\\nFN:<Name>\\nTEL:<Phone>\\nEND:VCARD",
      explanation: "QR (Quick Response) codes use Reed-Solomon Error Correction (L=7%, M=15%, Q=25%, H=30%) to store 2D alphanumeric matrices. Standard URI protocols allow smartphone cameras to auto-connect to WiFi networks or import vCard contact details instantly.",
      steps: [
        "Select your payload mode: URL, WiFi Network, Contact Card (vCard), Plain Text, Email, or UPI Payment.",
        "Enter the required fields (e.g. WiFi SSID & Password, Contact Details, or Link).",
        "Customize foreground & background colors and adjust Error Correction Level.",
        "Download high-resolution PNG or crisp vector SVG for physical printing and digital use."
      ],
    },
    examples: [
      {
        title: "Guest WiFi Network Access",
        description: "Generate a scan-to-connect QR code for home or office WiFi.",
        inputs: { "Network Name": "Office_Guest", "Security": "WPA2", "Password": "••••••••" },
        result: { "Format": "Standard WiFi URI", "Action": "Instant One-Tap Connect", "Privacy": "100% Client-Side" },
      },
      {
        title: "Digital Business Card (vCard)",
        description: "Create an interactive contact QR code for visiting cards.",
        inputs: { "Name": "Rahul Sharma", "Phone": "+91 98765 43210", "Email": "rahul@example.com" },
        result: { "Standard": "vCard 3.0", "Action": "Direct 'Add to Contacts' Prompt" },
      },
    ],
    faqs: [
      {
        question: "Is my WiFi password or contact information stored on your server?",
        answer: "No. The QR code is generated 100% client-side inside your browser's memory using HTML5 canvas and SVG APIs. No data is ever transmitted over the network.",
      },
      {
        question: "What is the difference between PNG and SVG downloads?",
        answer: "PNG is a raster image format ideal for websites, social media, and digital screens. SVG is a vector format with infinite scalability, making it the industry standard for print media (business cards, banners, menus) without pixelation.",
      },
      {
        question: "Which Error Correction level should I choose?",
        answer: "Medium (15%) is standard for general digital use. If you plan to print the QR code on merchandise, outdoors, or add a center logo, choose High (30%) for maximum scan reliability.",
      },
    ],
  },
];

export function getToolBySlug(slug: string): Tool | undefined {
  const normalized = slug.replace(/^\/+|\/+$/g, "");
  return TOOLS.find((t) => t.slug === normalized || t.slug === slug);
}

export function getToolsByCategory(category: string): Tool[] {
  const normCategory = category.toLowerCase();
  return TOOLS.filter(
    (t) => t.category.toLowerCase() === normCategory || t.categorySlug.toLowerCase() === normCategory
  );
}

export function getFeaturedTools(): Tool[] {
  return TOOLS.filter((t) => t.featured);
}

export function searchTools(query: string): Tool[] {
  if (!query.trim()) return TOOLS;
  const q = query.toLowerCase().trim();
  return TOOLS.filter((tool) => {
    return (
      tool.name.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      tool.category.toLowerCase().includes(q) ||
      tool.keywords.some((k) => k.toLowerCase().includes(q))
    );
  });
}
