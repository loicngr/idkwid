import {Position} from './Position'
import {
  Player,
  PLAYER_DIRECTION_IDLE_UP,
  PLAYER_DIRECTION_IDLE_LEFT,
  PLAYER_DIRECTION_IDLE_DOWN,
  PLAYER_DIRECTION_IDLE_RIGHT
} from './Player'
import {GLOBAL_VARIABLES_LIST, VARIABLE_SIZE_CELL} from '../consts'

export class Game {
  /**
     * @param {string} domRefElement
     * @param {string} domLevelsRefElement
     */
  constructor(domLevelsRefElement = 'levels') {
    this._domLevelsElement = document.getElementById(domLevelsRefElement)
    this._levels = []

    this._player = new Player(1, new Position(), document.createElement('div'))

    // Init class globals variables for CSS
    for (const globalVariablesListKey in GLOBAL_VARIABLES_LIST) {
      const item = GLOBAL_VARIABLES_LIST[globalVariablesListKey]

      if (item.jsRef === undefined)
        throw new Error(`jsRef for "${JSON.stringify(item)}" not found !`)

      if (this[item.value] === undefined)
        item.value = null

      this[item.jsRef] = item.value
    }

    this._SIZE_WINDOW = { x: window.innerWidth, y: window.innerHeight }
    this._isDev = import.meta.env.DEV
  }

  /**
     * Initialise basics
     */
  async init(withDraw = true) {
    this._getValuesFromCSS()
    this._generateLevels()
    this._initEventsListeners()

    if (withDraw)
      this.draw()
  }

  get levels() {
    return this._levels
  }

  get player() {
    return this._player
  }

  get isDev() {
    return this._isDev
  }

  /**
     * Get values from CSS variables
     *
     * @private
     */
  _getValuesFromCSS() {
    const _document = getComputedStyle(document.documentElement)
    for (const globalVariablesListKey in GLOBAL_VARIABLES_LIST) {
      const item = GLOBAL_VARIABLES_LIST[globalVariablesListKey]

      if (this[item.jsRef] === undefined)
        throw new Error(`jsRef "${item.jsRef}" not found !`)

      if (item.cssRef === undefined || item.cssRef === '')
        throw new Error(`cssRef for "${item.jsRef}" not found !`)

      if (item.cssFormat === undefined || typeof item.cssFormat !== 'function')
        throw new Error('cssFormat is not a function !')

      this[item.jsRef] = item.cssFormat(_document.getPropertyValue(`--${item.cssRef}`))
    }
  }

  /**
     * Generate levels
     *
     * @private
     */
  _generateLevels() {
    const maxY = this._SIZE_WINDOW.y - this[VARIABLE_SIZE_CELL]
    const maxX = this._SIZE_WINDOW.x - this[VARIABLE_SIZE_CELL]

    for (let y = 0; y < maxY; y += this[VARIABLE_SIZE_CELL]) {
      this._levels[y] = []

      for (let x = 0; x < maxX; x += this[VARIABLE_SIZE_CELL]) {
        this._levels[y][x] = { position: new Position(x, y) }
      }
    }
  }

  /**
     * Draw levels in dom target
     *
     * @private
     */
  _drawLevels() {
    const levels = this._levels

    for (const levelRowKey in levels) {
      const levelRow = levels[levelRowKey]

      for (const levelKey in levelRow) {
        const level = levelRow[levelKey]

        const divElement = document.createElement('div')
        divElement.setAttribute('x', level.position.x)
        divElement.setAttribute('y', level.position.y)
        divElement.classList.add('cell')
        divElement.style.left = `${level.position.x}px`
        divElement.style.top = `${level.position.y}px`

        if (this.isDev)
          divElement.classList.add('grid')

        this._domLevelsElement.appendChild(divElement)
      }
    }
  }

  /**
     * Draw player in dom target
     *
     * @private
     */
  _drawPlayer() {
    const player = this.player

    const divElement = player.domElement
    divElement.setAttribute('x', player.position.x)
    divElement.setAttribute('y', player.position.y)
    divElement.classList.add('player')

    player.directionClasses.forEach(_class => {
      divElement.classList.add(_class)
    })

    divElement.style.left = `${player.position.x}px`
    divElement.style.top = `${player.position.y}px`

    this._domLevelsElement.appendChild(divElement)
  }

  /**
     * When key has pressed
     *
     * @param {KeyboardEvent} keyboardEvent
     * @private
     */
  _onKeyDown(keyboardEvent) {
    keyboardEvent.preventDefault()
    const currentPlayer = this.player

    switch (keyboardEvent.code) {
    case 'ArrowRight': {
      const newPlayerX = currentPlayer.position.x + this[VARIABLE_SIZE_CELL]
      if (this._levels[currentPlayer.position.y][newPlayerX]) {
        this.player.direction = PLAYER_DIRECTION_IDLE_RIGHT
        this.player.setPositionX(newPlayerX)
      }
      break
    }
    case 'ArrowLeft': {
      const newPlayerX = currentPlayer.position.x - this[VARIABLE_SIZE_CELL]
      if (this._levels[currentPlayer.position.y][newPlayerX]) {
        this.player.direction = PLAYER_DIRECTION_IDLE_LEFT
        this.player.setPositionX(newPlayerX)
      }
      break
    }
    case 'ArrowUp': {
      const newPlayerY = currentPlayer.position.y - this[VARIABLE_SIZE_CELL]
      if (this._levels[newPlayerY]) {
        this.player.direction = PLAYER_DIRECTION_IDLE_UP
        this.player.setPositionY(newPlayerY)
      }
      break
    }
    case 'ArrowDown': {
      const newPlayerY = currentPlayer.position.y + this[VARIABLE_SIZE_CELL]
      if (this._levels[newPlayerY]) {
        this.player.direction = PLAYER_DIRECTION_IDLE_DOWN
        this.player.setPositionY(newPlayerY)
      }
      break
    }
    default:
      return
    }

    this.player.updateDirection()
    this._update()
  }

  _update () {
    const { player: { position: pPosition } } = this

    console.log(pPosition)
  }

  _onWindowResize() {
    this._SIZE_WINDOW = { x: window.innerWidth, y: window.innerHeight }

    // this._generateLevels()
    // this._drawLevels()
  }

  /**
     * Init events listeners
     *
     * @private
     */
  _initEventsListeners() {
    document.addEventListener('keydown', (e) => this._onKeyDown(e))
    window.addEventListener('resize', (e) => this._onWindowResize(e))
  }

  /**
     * Draw basics
     */
  draw() {
    this._drawLevels()
    this._drawPlayer()
  }
}
