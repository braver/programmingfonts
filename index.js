import { Filters } from './modules/filters.js'
import { Language } from './modules/language.js'
import { List } from './modules/list.js'
import { Listeners } from './modules/listeners.js'
import { Spacing } from './modules/spacing.js'
import { Theme } from './modules/theme.js'
import * as util from './modules/util.js'


// 2 globals: one representing the original json data,
// the other the reduced list that we're rendering
window.fontData = {}
window.fontsList = []

function renderSelectList () {
  const sortMode = document.getElementById('sort-list').value
  const fonts = window.fontsList
  const root = document.getElementById('select-font')
  const list = new List(window.fontData, fonts)

  fonts.sort((a, b) => {
    if (
      (list.isFav(a.alias) && !list.isFav(b.alias)) ||
      (list.hasFavChildren(a.alias) && !list.hasFavChildren(b.alias))
    ) {
      return -1
    }
    if (
      (!list.isFav(a.alias) && list.isFav(b.alias)) ||
      (!list.hasFavChildren(a.alias) && list.hasFavChildren(b.alias))) {
      return 1
    }
    return util.compare(a, b, sortMode)
  })

  root.innerHTML = ''

  fonts.forEach((v) => {
    const children = list.getGroups(fonts)[v.alias] || []

    if (list.isChild(v)) {
      // children are rendered in the sub-loop
      return
    }
    root.appendChild(list.renderItem(v))

    children.forEach((c) => {
      root.appendChild(list.renderItem(c))
    })
  })

  util.selectFont()
}

window.toggleFavorite = (alias) => {
  try {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || []
    if (favorites.indexOf(alias) > -1) {
      favorites = favorites.filter((v) => {
        return v !== alias
      })
    } else {
      favorites.push(alias)
    }
    localStorage.setItem('favorites', JSON.stringify(Array.from(new Set(favorites))))
  } catch (err) {
    console.error('could not save favorite', err)
  }
  renderSelectList()
}

window.onhashchange = () => {
  util.selectFont()
}

window.addEventListener('DOMContentLoaded', () => {
  util.initEditor()
  new Theme().init()
  new Spacing().init()
  new Language().init()
  new Listeners().init()

  // if a sort mode was stored, restore to that value before continue with rendering
  let sortMode = localStorage.getItem('sort-mode')
  if (sortMode) {
    document.getElementById('sort-list').value = sortMode
  }

  fetch('fonts.json')
    .then((response) => {
      if (response.ok) {
        return response.json()
      } else {
        console.error(response.status + ': ' + response.statusText)
      }
    }).then((data) => {

      window.fontData = data

      new Filters(data, () => {renderSelectList()}).init()
    })
})
