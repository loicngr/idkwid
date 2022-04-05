/** CSS */
import './assets/css/reset.css'
import './assets/css/variables.css'
import './assets/css/style.css'

/** JS */
import { Game } from './core/Game'
import { State } from './core/State'

/** @param {Game} game */
let game = null

/** @param {State} game */
let state = null

// POC `requestAnimationFrame`
// let lastTime = performance.now()
// function run() {
//   const time = performance.now()
//   const delta = time - lastTime
//
//   game.execute(delta, time)
//
//   lastTime = time
//   requestAnimationFrame(run)
// }

async function run () {
  await game.init()
}

(async () => {
  game = new Game()
  state = new State()

  state.gameInstance = game

  await run()
})()
