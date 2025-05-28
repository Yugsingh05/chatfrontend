type TimeOrDateResult = string;

export const calculateTime = (inputDateStr: string | number | Date): TimeOrDateResult => {
  const inputDate = new Date(inputDateStr);
  const currentDate = new Date();

  // Normalize both dates to local midnight (no time component) for day comparison
  const normalizeDate = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const inputNormalized = normalizeDate(inputDate);
  const currentNormalized = normalizeDate(currentDate);

  const msPerDay = 1000 * 60 * 60 * 24;
  const dayDiff = Math.floor((currentNormalized.getTime() - inputNormalized.getTime()) / msPerDay);

  const timeFormat: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "numeric" };
  const dateFormat: Intl.DateTimeFormatOptions = { day: "2-digit", month: "2-digit", year: "numeric" };

  if (dayDiff === 0) {
    // Today
    return inputDate.toLocaleTimeString("en-US", timeFormat);
  } else if (dayDiff === 1) {
    // Yesterday
    return "Yesterday";
  } else if (dayDiff > 1 && dayDiff <= 7) {
    // Within the past week
    const daysOfWeek = [
      "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];
    return daysOfWeek[inputDate.getDay()];
  } else {
    // Older than a week
    return inputDate.toLocaleDateString("en-GB", dateFormat);
  }
};
