export interface AgeResult {
  isValid: boolean;
  errorMessage?: string;
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalHours: number;
  totalWeeks: number;
  nextBirthdayDays: number;
}

export function calculateAge(dobStr: string, asOfStr?: string): AgeResult {
  if (!dobStr) {
    return {
      isValid: false,
      errorMessage: "Please select your date of birth.",
      years: 0,
      months: 0,
      days: 0,
      totalDays: 0,
      totalHours: 0,
      totalWeeks: 0,
      nextBirthdayDays: 0,
    };
  }

  const dob = new Date(dobStr + "T00:00:00");
  const asOf = asOfStr ? new Date(asOfStr + "T00:00:00") : new Date();

  if (isNaN(dob.getTime())) {
    return {
      isValid: false,
      errorMessage: "Invalid date of birth provided.",
      years: 0,
      months: 0,
      days: 0,
      totalDays: 0,
      totalHours: 0,
      totalWeeks: 0,
      nextBirthdayDays: 0,
    };
  }

  // Reject future DOB
  if (dob > asOf) {
    return {
      isValid: false,
      errorMessage: "Date of birth cannot be in the future.",
      years: 0,
      months: 0,
      days: 0,
      totalDays: 0,
      totalHours: 0,
      totalWeeks: 0,
      nextBirthdayDays: 0,
    };
  }

  let years = asOf.getFullYear() - dob.getFullYear();
  let months = asOf.getMonth() - dob.getMonth();
  let days = asOf.getDate() - dob.getDate();

  if (days < 0) {
    months -= 1;
    // Get previous month length
    const prevMonthLastDay = new Date(asOf.getFullYear(), asOf.getMonth(), 0).getDate();
    days += prevMonthLastDay;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const diffMs = asOf.getTime() - dob.getTime();
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalHours = totalDays * 24;
  const totalWeeks = Math.floor(totalDays / 7);

  // Next birthday calculation
  const currentYearBirthday = new Date(asOf.getFullYear(), dob.getMonth(), dob.getDate());
  let nextBirthday = currentYearBirthday;
  if (asOf > currentYearBirthday) {
    nextBirthday = new Date(asOf.getFullYear() + 1, dob.getMonth(), dob.getDate());
  }
  const nextBirthdayDiffMs = nextBirthday.getTime() - asOf.getTime();
  const nextBirthdayDays = Math.ceil(nextBirthdayDiffMs / (1000 * 60 * 60 * 24));

  return {
    isValid: true,
    years,
    months,
    days,
    totalDays,
    totalHours,
    totalWeeks,
    nextBirthdayDays,
  };
}

export interface DateDifferenceResult {
  isValid: boolean;
  errorMessage?: string;
  totalDays: number;
  inclusiveDays: number;
  years: number;
  months: number;
  days: number;
  weeks: number;
  remainingDays: number;
  workingDays: number;
  weekendDays: number;
}

export function calculateDateDifference(
  startDateStr: string,
  endDateStr: string,
  inclusive: boolean = false
): DateDifferenceResult {
  if (!startDateStr || !endDateStr) {
    return {
      isValid: false,
      errorMessage: "Please select both start and end dates.",
      totalDays: 0,
      inclusiveDays: 0,
      years: 0,
      months: 0,
      days: 0,
      weeks: 0,
      remainingDays: 0,
      workingDays: 0,
      weekendDays: 0,
    };
  }

  const start = new Date(startDateStr + "T00:00:00");
  const end = new Date(endDateStr + "T00:00:00");

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return {
      isValid: false,
      errorMessage: "Invalid dates provided.",
      totalDays: 0,
      inclusiveDays: 0,
      years: 0,
      months: 0,
      days: 0,
      weeks: 0,
      remainingDays: 0,
      workingDays: 0,
      weekendDays: 0,
    };
  }

  // Ensure chronological order for duration logic
  const [d1, d2] = start <= end ? [start, end] : [end, start];

  const diffMs = d2.getTime() - d1.getTime();
  const rawDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  const totalDays = rawDays;
  const inclusiveDays = rawDays + 1;

  // Calendar breakdown
  let years = d2.getFullYear() - d1.getFullYear();
  let months = d2.getMonth() - d1.getMonth();
  let days = d2.getDate() - d1.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonthDays = new Date(d2.getFullYear(), d2.getMonth(), 0).getDate();
    days += prevMonthDays;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const weeks = Math.floor((inclusive ? inclusiveDays : totalDays) / 7);
  const remainingDays = (inclusive ? inclusiveDays : totalDays) % 7;

  // Calculate working/weekend days
  let workingDays = 0;
  let weekendDays = 0;
  const loopEnd = inclusive ? totalDays : totalDays - 1;

  for (let i = 0; i <= loopEnd; i++) {
    const current = new Date(d1.getTime() + i * 24 * 60 * 60 * 1000);
    const dayOfWeek = current.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      weekendDays++;
    } else {
      workingDays++;
    }
  }

  return {
    isValid: true,
    totalDays,
    inclusiveDays,
    years,
    months,
    days,
    weeks,
    remainingDays,
    workingDays,
    weekendDays,
  };
}
