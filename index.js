import { Filters } from './modules/filters.js'
import { Language } from './modules/language.js'
import { Listeners } from './modules/listeners.js'
import { Spacing } from './modules/spacing.js'
import { Theme } from './modules/theme.js'
import * as util from './modules/util.js'


const chevronDownIcon = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M12.78 5.22a.749.749 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.06 0L3.22 6.28a.749.749 0 1 1 1.06-1.06L8 8.939l3.72-3.719a.749.749 0 0 1 1.06 0Z"/></svg>'
const arrowIcon =
      '<svg class="octicon" viewBox="0 0 16 16" width="14" height="14"><path d="M4.53 4.75A.75.75 0 0 1 5.28 4h6.01a.75.75 0 0 1 .75.75v6.01a.75.75 0 0 1-1.5 0v-4.2l-5.26 5.261a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734L9.48 5.5h-4.2a.75.75 0 0 1-.75-.75Z"></path></svg>'
const pinIcon =
      '<svg class="octicon" viewBox="0 0 16 16" width="12" height="12"><path d="m8 14.25.345.666a.75.75 0 0 1-.69 0l-.008-.004-.018-.01a7.152 7.152 0 0 1-.31-.17 22.055 22.055 0 0 1-3.434-2.414C2.045 10.731 0 8.35 0 5.5 0 2.836 2.086 1 4.25 1 5.797 1 7.153 1.802 8 3.02 8.847 1.802 10.203 1 11.75 1 13.914 1 16 2.836 16 5.5c0 2.85-2.045 5.231-3.885 6.818a22.066 22.066 0 0 1-3.744 2.584l-.018.01-.006.003h-.002ZM4.25 2.5c-1.336 0-2.75 1.164-2.75 3 0 2.15 1.58 4.144 3.365 5.682A20.58 20.58 0 0 0 8 13.393a20.58 20.58 0 0 0 3.135-2.211C12.92 9.644 14.5 7.65 14.5 5.5c0-1.836-1.414-3-2.75-3-1.373 0-2.609.986-3.029 2.456a.749.749 0 0 1-1.442 0C6.859 3.486 5.623 2.5 4.25 2.5Z"></path></svg>'
const pinnedIcon =
      '<svg class="octicon" viewBox="0 0 16 16" width="12" height="12"><path d="M7.655 14.916v-.001h-.002l-.006-.003-.018-.01a22.066 22.066 0 0 1-3.744-2.584C2.045 10.731 0 8.35 0 5.5 0 2.836 2.086 1 4.25 1 5.797 1 7.153 1.802 8 3.02 8.847 1.802 10.203 1 11.75 1 13.914 1 16 2.836 16 5.5c0 2.85-2.044 5.231-3.886 6.818a22.094 22.094 0 0 1-3.433 2.414 7.152 7.152 0 0 1-.31.17l-.018.01-.008.004a.75.75 0 0 1-.69 0Z"></path></svg>'


function getFavs() {
  let favoritesMap = {}
  let favorites = []

  try {
    favorites = JSON.parse(localStorage.getItem('favorites')) || []
    favoritesMap = favorites.reduce((acc, alias) => {
      acc[alias] = true
      return acc
    }, {})
  } catch (err) {
    console.error('could not render favorites', err)
  }

  return favoritesMap
}

function getGroups(fonts) {
  const groups = {}

  fonts.forEach((v) => {
    if (v.group && v.group !== v.alias) {
      if (!groups[v.group]) groups[v.group] = []
      groups[v.group].push(v)
    }
  })

  return groups
}

function renderContent(data, chevron, heart) {
  return `
    <a href="#${data.alias}" data-style="${data.style}">
      <span class="name">${data.name}</span>
      <span class="details">${data.year} — ${data.author}</span>
    </a>
    ${chevron}
    <a class="favoritelink" title="Favourite" onclick="toggleFavorite('${data.alias}')">${heart}</a>
    ${data.website ? `<a class="website" href="${data.website}" rel="external"> <span>Website</span>${arrowIcon}</a>` : ''}
  `
}

function isChild(data) {
  return data.group && data.group !== data.alias
}

function renderItem(data, isFav=false, nChildren=0) {
  const option = document.createElement('div')
  option.classList.add('entry')
  option.setAttribute('data-alias', data.alias)

  let heart = pinIcon
  let chevron = ''
  if (isFav) {
    option.classList.add('pinned')
    heart = pinnedIcon
  }

  if (nChildren > 0) {
    chevron =  `<button title="Alternatives" class="group-toggle" onclick="toggleGroup('${data.alias}')">+${nChildren} ${chevronDownIcon}</button>`
  }

  option.innerHTML = renderContent(data, chevron, heart)

  if (isChild(data)) {
    option.setAttribute('data-child-of', data.group)
    option.classList.add('hidden')
  }
  return option
}

function renderSelectList () {
  const sortMode = document.getElementById('sort-list').value
  const fonts = window.fontsList
  const favoritesMap = getFavs()
  const root = document.getElementById('select-font')

  fonts.sort((a, b) => {
    if (favoritesMap[a.alias] && !favoritesMap[b.alias]) {
      return -1
    }
    if (!favoritesMap[a.alias] && favoritesMap[b.alias]) {
      return 1
    }
    return util.compare(a, b, sortMode)
  })

  root.innerHTML = ''

  fonts.forEach((v) => {
    const children = getGroups(fonts)[v.alias] || []

    if (isChild(v)) {
      // children are rendered in the sub-loop
      return
    }
    root.appendChild(renderItem(v, favoritesMap[v.alias] !== undefined, children.length))

    children.forEach((c) => {
      root.appendChild(renderItem(c, favoritesMap[v.alias] !== undefined))
    })
  })

  util.selectFont()
}

window.toggleGroup = (alias) => {
  document.querySelector(`#select-font [data-alias='${alias}']`).classList.toggle('group-open')
  document.querySelectorAll(`#select-font [data-child-of='${alias}']:not(.pinned)`).forEach((child) => {
    child.classList.toggle('hidden')
  })
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
  window.location.hash = alias
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
      window.fontsList = []

      Object.keys(data).forEach((key) => {
        const v = data[key]
        v.alias = key
        window.fontsList.push(v)
      })

      renderSelectList()
      new Filters(data, () => {renderSelectList()}).init()
    })
})
