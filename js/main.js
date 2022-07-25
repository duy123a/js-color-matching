import { GAME_STATUS, PAIRS_COUNT, GAME_TIME } from './constants.js'
import { getRandomColorPairs } from './utils.js'
import { getColorElementList, getColorListElement } from './selectors.js'

// Global variables
let selections = []
let gameState = GAME_STATUS.PLAYING

// TODOs
// 1. Generating colors using https://github.com/davidmerfield/randomColor
// 2. Attach item click for all li elements
// 3. Check win logic
// 4. Add timer
// 5. Handle replay click

function initColor() {
  // get random 8 colors
  // bind to li > div.overlay
  const fullColorList = getRandomColorPairs(PAIRS_COUNT)
  const colorElementList = getColorElementList()
  if (!colorElementList) return
  colorElementList.forEach((colorElement, index) => {
    const overlayElement = colorElement.querySelector('.overlay')
    if (overlayElement) overlayElement.style.backgroundColor = fullColorList[index]
  })
}

;(() => {
  initColor()
})()
