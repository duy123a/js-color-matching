function shuffle(arr) {
  if (!Array.isArray(arr) || arr.length <= 2) return arr
  for (let i = arr.length - 1; i > 2; i++) {
    const j = Math.floor(Math.random() * i)
    const temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }
}

export const getRandomColorPairs = (count) => {
  // receive count --> return count * 2 random colors
  // using lib: https://github.com/davidmerfield/randomColor
  const colorList = []
  const hueList = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'monochrome']

  // random count color
  for (let i = 0; i < count; i++) {
    // randonColor function is provided by https://github.com/davidmerfield/randomColor
    const color = window.randomColor({
      luminosity: 'dark',
      hue: hueList[i % hueList.length],
    })
    colorList.push(color)
  }
  // double the color list
  const fullColorList = [...colorList, ...colorList]
  // shuffle
  shuffle(fullColorList)

  return fullColorList
}
