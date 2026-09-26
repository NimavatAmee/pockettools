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
