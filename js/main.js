import { GAME_STATUS, PAIRS_COUNT, GAME_TIME } from './constants.js'
import {
  getRandomColorPairs,
  showTimerText,
  showReplayButton,
  hideReplayButton,
  createTimer,
} from './utils.js'
import {
  getColorElementList,
  getColorListElement,
  getInactiveColorList,
  getPlayAgainButton,
  getColorBackground,
} from './selectors.js'

// Global variables
let selections = []
let gameState = GAME_STATUS.PLAYING
let timer = createTimer({
  seconds: GAME_TIME,
  onChange: handleTimerChange,
  onFinish: handleTimerFinish,
})

function handleTimerChange(seconds) {
  seconds = `0${seconds}`.slice(-2)
  showTimerText(seconds)
}

function handleTimerFinish() {
  showReplayButton()
  showTimerText('Game over!')
  gameState = GAME_STATUS.FINISHED
  selections = []
}
// TODOs
// 1. Generating colors using https://github.com/davidmerfield/randomColor
// 2. Attach item click for all li elements
// 3. Check win logic
// 4. Add timer
// 5. Handle replay click

// console.log(getRandomColorPairs(4))

function handleColorClick(liElement) {
  const shouldBlock = [GAME_STATUS.BLOCKING, GAME_STATUS.FINISHED].includes(gameState)
  const isClicked = liElement.classList.contains('active')
  if (!liElement || shouldBlock || isClicked) return
  liElement.classList.add('active')
  // add clicked cell to selections
  selections.push(liElement)
  if (selections.length < 2) return
  // check match
  const firstColor = selections[0].dataset.color
  const secondColor = selections[1].dataset.color
  const isMatch = firstColor === secondColor
  // handle match case
  if (isMatch) {
    // handle win case
    const isWin = getInactiveColorList().length === 0
    if (isWin) {
      // show replay
      // show win
      timer.clear()
      showReplayButton()
      showTimerText('You win!🎉')
      gameState = GAME_STATUS.FINISHED
    }
    // change background
    const colorBackgroundElement = getColorBackground()
    if (colorBackgroundElement) {
      colorBackgroundElement.style.backgroundColor = selections[0].dataset.color
    }
    // clear the selections
    selections = []
    return
  }
  // else
  gameState = GAME_STATUS.BLOCKING
  setTimeout(() => {
    selections[0].classList.remove('active')
    selections[1].classList.remove('active')
    // reset selection
    selections = []
    // race condition with handleTimerFinish
    if (gameState !== GAME_STATUS.FINISHED) {
      gameState = GAME_STATUS.PLAYING
    }
  }, 500)
}

function initColor() {
  // get random 8 colors
  // bind to li > div.overlay
  const fullColorList = getRandomColorPairs(PAIRS_COUNT)
  const colorElementList = getColorElementList()
  if (!colorElementList) return
  colorElementList.forEach((colorElement, index) => {
    colorElement.dataset.color = fullColorList[index]
    const overlayElement = colorElement.querySelector('.overlay')
    if (overlayElement) {
      overlayElement.style.backgroundColor = fullColorList[index]
      // overlayElement.style.pointerEvents = 'none'
    }
  })
}

function resetGame() {
  // reset global var
  gameState = GAME_STATUS.PLAYING
  selections = []
  // reset DOM elements
  const colorList = getColorElementList()
  if (colorList) {
    for (const color of colorList) {
      color.classList.remove('active')
    }
  }
  hideReplayButton()
  showTimerText('')
  // re-generate new colors
  initColor()
  // reset background color
  const colorBackgroundElement = getColorBackground()
  if (colorBackgroundElement) {
    colorBackgroundElement.style.backgroundColor = 'goldenrod'
  }
  // reset timer
  startTimer()
}

function attachEventForColorList() {
  // add click event for the color list
  const ulElement = getColorListElement()
  if (!ulElement) return
  ulElement.addEventListener('click', (event) => {
    let target = event.target
    // console.log(target)
    if (target.tagName !== 'LI') return
    handleColorClick(target)
  })
}

function attachEventForReplayButton() {
  const playAgainButton = getPlayAgainButton()
  if (!playAgainButton) return
  playAgainButton.addEventListener('click', (event) => {
    resetGame()
  })
}

function startTimer() {
  timer.start()
}

;(() => {
  initColor()
  attachEventForColorList()
  attachEventForReplayButton()
  startTimer()
})()
