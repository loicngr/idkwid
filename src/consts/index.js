export const VARIABLE_SIZE_CELL = 'sizeCell'
export const VARIABLE_CAMERA_BORDER_MARGIN = 'cameraBorderMargin'

export const GLOBAL_VARIABLES_LIST = [
  {
    jsRef: VARIABLE_SIZE_CELL,
    cssRef: 'game-core-size-cell',
    cssFormat: (i) => parseInt(i),
    value: 0
  },
  {
    jsRef: VARIABLE_CAMERA_BORDER_MARGIN,
    cssRef: 'game-core-camera-border-margin',
    cssFormat: (i) => parseInt(i),
    value: 0
  }
]
