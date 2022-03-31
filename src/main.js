/** CSS */
import './assets/css/reset.css'
import './assets/css/variables.css'
import './assets/css/style.css'

/** JS */
import { Game } from './core/Game'
import {State} from './core/State';

(async () => {
  const game = new Game()
  const state = new State()

  state.gameInstance = game

  await game.init()
})()
