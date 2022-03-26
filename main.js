/** CSS */
import './reset.css'
import './style.css'

/** JS */
import { Game } from './core/Game.js'
import {State} from "./core/State.js";

(async () => {
    const game = new Game()
    const state = new State()

    state.gameInstance = game

    await game.init()
})()