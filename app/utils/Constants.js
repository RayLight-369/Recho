export const STATUS = [
  "progress",
  "approval",
  "complete"
];

export const PRIORITY = ( value ) => {
  return value > 5 ? "urgent" : "normal";
};