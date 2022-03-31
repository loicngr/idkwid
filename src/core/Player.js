export const PLAYER_DIRECTION_IDLE_DOWN = 0
export const PLAYER_DIRECTION_IDLE_UP = 1
export const PLAYER_DIRECTION_IDLE_LEFT = 2
export const PLAYER_DIRECTION_IDLE_RIGHT = 3

export class Player {
  constructor(id, position, domElement) {
    this._id = id
    this._position = position
    this._domElement = domElement
    this._direction = PLAYER_DIRECTION_IDLE_DOWN
    this._directionClasses = ['idle', 'down']
  }

  get id () {
    return this._id
  }

  get direction () {
    return this._direction
  }

  set direction (direction) {
    this._direction = direction
  }

  get directionClasses () {
    return this._directionClasses
  }

  updateDirection () {
    let newClasses = []

    switch (this._direction) {
    case PLAYER_DIRECTION_IDLE_DOWN:
      newClasses.push('idle', 'down')
      break
    case PLAYER_DIRECTION_IDLE_UP:
      newClasses.push('idle', 'up')
      break
    case PLAYER_DIRECTION_IDLE_LEFT:
      newClasses.push('idle', 'left')
      break
    case PLAYER_DIRECTION_IDLE_RIGHT:
      newClasses.push('idle', 'right')
      break
    default:
      break
    }

    const oldClasses = this._directionClasses
    oldClasses.forEach(_class => {
      this.domElement.classList.remove(_class)
    })
    newClasses.forEach(_class => {
      this.domElement.classList.add(_class)
    })

    this._directionClasses = newClasses
  }

  setPositionX (x, reDraw = true) {
    this._position.x = x

    if (reDraw)
      this.domElement.style.left = `${this._position.x}px`
  }

  setPositionY (y, reDraw = true) {
    this._position.y = y

    if (reDraw)
      this.domElement.style.top = `${this._position.y}px`
  }

  get position () {
    return this._position
  }

  get domElement () {
    return this._domElement
  }
}
