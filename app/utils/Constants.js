export const STATUS = ( value ) => [
  "progress",
  "approval",
  "complete"
][ value ];

export const PRIORITY = ( value ) => [ "neutral", "low", "medium", "high" ][ value ];