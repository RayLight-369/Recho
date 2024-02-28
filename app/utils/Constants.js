export const STATUS = ( value ) => [
  [ "progress", "#0035ff" ],
  [ "approval", "#ffaa00" ],
  [ "complete", "#00dd88" ],
][ value ];

export const PRIORITY = ( value ) => [
  [ "neutral", "#343443" ],
  [ "low", "#00ddcc" ],
  [ "medium", "#ffaa00" ],
  [ "high", "#ff0044" ]
][ value ];