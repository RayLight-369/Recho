export const STATUS = ( value ) => [
  [ "progress", "#0035ff", "rgb(236 240 255)" ],
  [ "approval", "#ffaa00", "#fff9ed" ],
  [ "complete", "#00dd88", "#eefff8" ],
][ value ];

export const PRIORITY = ( value ) => [
  [ "neutral", "#343443" ],
  [ "low", "#00ddcc" ],
  [ "medium", "#ffaa00" ],
  [ "high", "#ff0044" ]
][ value ];