import { format, differenceInCalendarDays } from "date-fns";

export const formatDate = (date) => {
  if (!date) return "";
  return format(new Date(date), "dd MMM yyyy");
};

export const tripDurationLabel = (startDate, endDate) => {
  if (!startDate || !endDate) return "";
  const days = differenceInCalendarDays(new Date(endDate), new Date(startDate)) + 1;
  return `${days} Day${days > 1 ? "s" : ""}`;
};

export const formatCurrency = (value) => {
  if (value === undefined || value === null || value === "") return "";
  const num = Number(value);
  if (Number.isNaN(num)) return value; // AI sometimes returns a range string
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
};

export const getInitials = (name = "") => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};
