class Position {
    constructor(x = 0, y = 0) {
        this._x = x
        this._y = y
    }

    get x() {
        return this._x
    }

    set x(x) {
        this._x = x
    }

    get y() {
        return this._y
    }

    set y(y) {
        this._y = y
    }
}

class Player {
    constructor(id, position, domElement) {
        this._id = id
        this._position = position
        this._domElement = domElement
    }

    get id () {
        return this._id
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

export class Game {
    /**
     * @param {string} domRefElement
     * @param {string} domLevelsRefElement
     */
    constructor(domRefElement = 'app', domLevelsRefElement = 'levels') {
        // this._domElement = document.getElementById(domRefElement)
        this._domLevelsElement = document.getElementById(domLevelsRefElement)
        this._levels = []

        this._player = new Player(1, new Position(), document.createElement('div'))
        this._SIZE_CELL = 0
        this._SIZE_WINDOW = { x: (window.innerWidth - 150), y: (window.innerHeight - 150) }

        this._config = {}
    }

    /**
     * Initialise basics
     */
   init(withDraw = true) {
        this._importConfig()
            .then((config) => {
                this._config = config

                this._getValuesFromCSS()
                this._generateLevels()
                this._initEventsListeners()

                if (withDraw)
                    this.draw()
            })
            .catch(() => {
                throw new Error("Can't find config file")
            })
    }

    get levels() {
        return this._levels
    }

    get player() {
        return this._player
    }

    get isDev() {
       return this._config.env === 'dev'
    }

    /**
     * Import config variables from file
     *
     * @private
     */
    async _importConfig() {
        return new Promise((resolve, reject) => {
            fetch('config.json')
                .then((r) => r.json())
                .then(resolve)
                .catch(reject)
        })
    }

    /**
     * Get values from CSS variables
     *
     * @private
     */
    _getValuesFromCSS() {
        this._SIZE_CELL = parseInt(getComputedStyle(document.documentElement)
            .getPropertyValue('--game-core-size-cell'))
    }

    /**
     * Generate levels
     *
     * @private
     */
    _generateLevels() {
        for (let y = 0; y <= this._SIZE_WINDOW.y; y += this._SIZE_CELL) {
            this._levels[y] = []

            for (let x = 0; x <= this._SIZE_WINDOW.x; x += this._SIZE_CELL) {
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
                const newPlayerX = currentPlayer.position.x + this._SIZE_CELL
                if (this._levels[currentPlayer.position.y][newPlayerX]) {
                    this.player.setPositionX(newPlayerX)
                }
                break
            }
            case 'ArrowLeft': {
                const newPlayerX = currentPlayer.position.x - this._SIZE_CELL
                if (this._levels[currentPlayer.position.y][newPlayerX]) {
                    this.player.setPositionX(newPlayerX)
                }
                break
            }
            case 'ArrowUp': {
                const newPlayerY = currentPlayer.position.y - this._SIZE_CELL
                if (this._levels[newPlayerY]) {
                    this.player.setPositionY(newPlayerY)
                }
                break
            }
            case 'ArrowDown': {
                const newPlayerY = currentPlayer.position.y + this._SIZE_CELL
                if (this._levels[newPlayerY]) {
                    this.player.setPositionY(newPlayerY)
                }
                break
            }
            default:
                return
        }
    }

    // _onWindowResize() {
    //     this._SIZE_WINDOW = { x: window.innerWidth, y: window.innerHeight }
    //
    //     this._drawLevels()
    // }

    /**
     * Init events listeners
     *
     * @private
     */
    _initEventsListeners() {
        document.addEventListener('keydown', (e) => this._onKeyDown(e))
        // window.addEventListener('resize', (e) => this._onWindowResize(e));
    }

    /**
     * Draw basics
     */
    draw() {
        this._drawLevels()
        this._drawPlayer()
    }
}
