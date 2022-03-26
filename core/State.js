export class State {
    constructor() {
        this._gameInstance = null
    }

    /**
     * @param {Game|null} game
     */
    set gameInstance (game) {
        this._gameInstance = game
    }

    get gameInstance () {
        return this._gameInstance
    }
}
