/** CSS */
import './assets/css/reset.css'
import './assets/css/style.css'


const LEVELS_SIZE = {
  x: 512,
  y: 512
}
const LEVEL_CELL_SIZE = 64

/** JS */
class Position {
  /**
   * @param {number} x
   * @param {number} y
   */
  constructor(x = 0, y = 0) {
    this._x = x
    this._y = y
  }

  get x () {
    return this._x
  }

  /** @param {number} x */
  set x (x) {
    this._x = x
  }

  get y () {
    return this._y
  }

  /** @param {number} y */
  set y (y) {
    this._y = y
  }
}

class Game {
  constructor() {
    /** @param {HTMLCanvasElement} _canvas */
    this._canvas = document.getElementById('game')

    if (!this._canvas.getContext) {
      alert('browser not supported')
      throw new Error('Canvas not supported')
    }

    /** @param {CanvasRenderingContext2D} _ctx */
    this._ctx = this._canvas.getContext('2d')

    this._levels = []

    this._cameraPosition = new Position(0, 0)
    this._playerPosition = new Position(0, 0)

    this._generateLevels()

    document.addEventListener('keydown', (e) => this._onKeyDown(e))
  }

  _onKeyDown (keyEvent) {
    switch (keyEvent.code) {
    case 'ArrowRight':
      this._playerPosition = new Position(this._playerPosition.x + LEVEL_CELL_SIZE, this._playerPosition.y)
      break
    case 'ArrowLeft':
      this._playerPosition = new Position(this._playerPosition.x - LEVEL_CELL_SIZE, this._playerPosition.y)
      break
    case 'ArrowUp':
      this._playerPosition = new Position(this._playerPosition.x, this._playerPosition.y - LEVEL_CELL_SIZE)
      break
    case 'ArrowDown':
      this._playerPosition = new Position(this._playerPosition.x, this._playerPosition.y + LEVEL_CELL_SIZE)
      break
    default:
      break
    }
  }

  _generateLevels () {
    const maxY = LEVELS_SIZE.y
    const maxX = LEVELS_SIZE.x

    for (let y = 0; y < maxY; y += LEVEL_CELL_SIZE) {
      this._levels[y] = []

      for (let x = 0; x < maxX; x += LEVEL_CELL_SIZE) {
        this._levels[y][x] = {
          style: 'rgb(0, 0, 0)',
          position: new Position(x, y)
        }
      }
    }
  }

  _drawCameraPosition () {
    const { x, y } = this._cameraPosition

    this._ctx.fillStyle = 'rgb(50, 50, 50)'
    this._ctx.fillRect(x, y, LEVEL_CELL_SIZE, LEVEL_CELL_SIZE)
  }

  _drawPlayerPosition () {
    const { x, y } = this._playerPosition

    this._ctx.fillStyle = 'rgb(200, 0, 0)'
    this._ctx.fillRect(x, y, LEVEL_CELL_SIZE, LEVEL_CELL_SIZE)
  }

  _drawLevels () {
    const levels = this._levels

    for (const levelRowKey in levels) {
      const levelRow = levels[levelRowKey]

      for (const levelKey in levelRow) {
        const level = levelRow[levelKey]

        this._ctx.fillStyle = level.style
        this._ctx.fillRect(level.position.x, level.position.y, LEVEL_CELL_SIZE, LEVEL_CELL_SIZE)
      }
    }
  }

  execute () {
    this._drawLevels()
    this._drawCameraPosition()
    this._drawPlayerPosition()
  }
}

/** @param {Game} game */
let game = null

let lastTime = performance.now()
function run() {
  const time = performance.now()
  const delta = time - lastTime

  game.execute(delta, time)

  lastTime = time
  requestAnimationFrame(run)
}

(async () => {
  game = new Game()

  await run()
})()
