export const STATUS = [
  [ "progress", "#0035ff", "rgb(236 240 255)" ],
  [ "approval", "#ffaa00", "#fff9ed" ],
  [ "complete", "#00dd88", "#eefff8" ],
];

export const PRIORITY = [
  [ "Neutral", "#474747", "#e9e9e9" ],
  [ "Low", "#047c73", "#ecfffe" ],//#00ddcc
  [ "Medium", "#9a6600", "#fff9ee" ],//#ffaa00
  [ "High", "#e2003c", "#ffeff3" ]//#ff0044
];

export const HIGHER_ROLES = [ "owner", "admin" ];
export const LOWER_ROLES = [ "member", "spectator" ];

export const REALTIME_URL = process.env.NEXT_PUBLIC_REALTIME_URL;