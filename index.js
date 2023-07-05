/* global CodeMirror plausible */

import { Cookies } from './modules/cookies.js'
import { Fontsize } from './modules/fontsize.js'
import { Filters } from './modules/filters.js'
import { Language } from './modules/language.js'
import { Spacing } from './modules/spacing.js'
import { Theme } from './modules/theme.js'

let fontData

const fontsize = new Fontsize()

window.CMeditor = CodeMirror.fromTextArea(document.getElementById('code'), {
  lineNumbers: true,
  styleActiveLine: true,
  matchBrackets: true,
  theme: 'pastel-on-dark',
  lineWrapping: true
})

/**
 * Get the font from the #, the cookie, or a default
 */
function getFont () {
  let font = window.location.hash.substring(1)

  if (!font) {
    font = Cookies.get('font')
  }

  if (!font) {
    font = 'source-code-pro'
  }

  return font
}

// ProgrammingFonts font selector
const selectFont = () => {
  const msg = document.querySelector('footer .subtitle')
  const codeMirror = document.querySelector('.CodeMirror')
  const font = getFont()

  if (typeof fontData !== 'undefined') {
    msg.innerHTML = `Test drive <a rel="external" href="${fontData[font].website}">${fontData[font].name}!</a>`
  }

  if (typeof fontData !== 'undefined' && fontData[font].rendering === 'bitmap') {
    codeMirror.classList.add('no-smooth')
    if (fontData[font]['bitmap size']) {
      fontsize.forceSize(fontData[font]['bitmap size'])
    }
  } else {
    codeMirror.classList.remove('no-smooth')
    fontsize.reset()
  }

  if (font === 'input') {
    codeMirror.style.fontFamily = 'Input Mono, monospace'
    codeMirror.querySelectorAll('pre, textarea').forEach((element) => {
      element.style.fontFamily = 'Input Mono, monospace'
    })
  } else {
    codeMirror.style.fontFamily = `${font}, monospace`
    codeMirror.querySelectorAll('pre, textarea').forEach((element) => {
      element.style.fontFamily = `${font}, monospace`
    })
  }

  document.querySelectorAll('#select-font [data-alias]').forEach((element) => {
    element.classList.remove('active')
  })
  document.querySelectorAll(`#select-font [data-alias='${font}']`).forEach((element) => {
    element.classList.add('active')
  })

  Cookies.set('font', font)
}

function renderSelectList () {
  const icon =
        '<svg class="octicon" viewBox="0 0 12 14" version="1.1" width="12" height="14" aria-hidden="true"><path fill-rule="evenodd" d="M11 10h1v3c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V3c0-.55.45-1 1-1h3v1H1v10h10v-3zM6 2l2.25 2.25L5 7.5 6.5 9l3.25-3.25L12 8V2H6z"></path></svg>'
  const pinIcon =
        '<svg class="octicon octicon-pin" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10 1.2V2l.5 1L6 6H2.2c-.44 0-.67.53-.34.86L5 10l-4 5 5-4 3.14 3.14a.5.5 0 0 0 .86-.34V10l3-4.5 1 .5h.8c.44 0 .67-.53.34-.86L10.86.86a.5.5 0 0 0-.86.34z"></path></svg>'
  let favoritesMap = {}
  let favorites = []
  const ajax = new XMLHttpRequest()

  document.getElementById('select-font').innerHTML = ''

  try {
    favorites = JSON.parse(localStorage.getItem('favorites')) || []
    favoritesMap = favorites.reduce((acc, alias) => {
      acc[alias] = true
      return acc
    }, {})
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('could not render favorites', err)
  }

  ajax.onreadystatechange = () => {
    const fonts = []
    const authors = []
    if (ajax.readyState === 4 && ajax.status === 200) {
      fontData = ajax.response

      Object.keys(fontData).forEach((key) => {
        const v = fontData[key]
        v.alias = key
        fonts.push(v)
        if (authors.indexOf(v.author) < 0) {
          authors.push(v.author)
        }
      })
    }

    authors.sort()
    fonts.sort((a, b) => {
      if (favoritesMap[a.alias] && !favoritesMap[b.alias]) {
        return -1
      }
      if (!favoritesMap[a.alias] && favoritesMap[b.alias]) {
        return 1
      }
      if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return -1
      }
      if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return 1
      }
      return 0
    })

    authors.forEach((author) => {
      const option = document.createElement('option')
      option.innerHTML = author
      document.getElementById('authors-list').querySelector('.other').appendChild(option)
    })

    fonts.forEach((v) => {
      const option = document.createElement('div')

      option.classList.add('entry')
      if (favoritesMap[v.alias]) {
        option.classList.add('pinned')
      }

      option.setAttribute('data-alias', v.alias)
      option.innerHTML = `<a href="#${v.alias}" data-style="${v.style}"><span class="name">${v.name}</span><span class="details">${v.year} — ${v.author}</span></a><a class="favoritelink" onclick="toggleFavorite('${v.alias}')">${pinIcon}</a><a class="website" href="${v.website}" rel="external"> <span>Website</span>${icon}</a>`

      document.getElementById('select-font').appendChild(option)
    })

    selectFont()
    new Filters(fontData).init()
  }
  ajax.responseType = 'json'
  ajax.open('GET', 'fonts.json', true)
  ajax.send()
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
    // eslint-disable-next-line no-console
    console.error('could not save favorite', err)
  }
  renderSelectList()
  return false
}

function walk (direction) {
  const activeEntry = document.querySelector('.entry.active')
  let target = null
  let next = direction === 'up' ? activeEntry.previousElementSibling : activeEntry.nextElementSibling

  while (target === null) {
    if (next) {
      if (next.matches('.entry:not(.filtered-out)')) {
        target = next
      } else {
        next = direction === 'up' ? next.previousElementSibling : next.nextElementSibling
      }
    } else {
      target = false
    }
  }

  function isVisible (el) {
    const offset = document.getElementById('filters').getBoundingClientRect().height
    const container = document.querySelector('section.select-list').getBoundingClientRect().height
    if (direction === 'up') {
      if (el.getBoundingClientRect().top < offset) {
        return false
      }
    } else {
      if (el.getBoundingClientRect().bottom > offset + container) {
        return false
      }
    }

    return true
  }

  if (target) {
    target.querySelector('a').click()
    if (!isVisible(target)) {
      target.scrollIntoView()
    }
  }
}

window.onhashchange = () => {
  plausible('Font Selected')
  selectFont()
}

window.addEventListener('DOMContentLoaded', () => {
  renderSelectList()
  new Theme().init()
  fontsize.init()
  new Spacing().init()
  new Language().init()

  document.querySelector('.select-list').onkeyup = (event) => {
    if (event.ctrlKey || event.altKey || event.metaKey || event.shiftKey) {
      return
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      event.stopPropagation()
      walk('up')
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      event.stopPropagation()
      walk('down')
    }
  }

  document.body.addEventListener('keydown', (event) => {
    if (event.ctrlKey || event.metaKey) {
      if (event.key === '-') {
        event.preventDefault()
        event.stopPropagation()
        fontsize.down()
      } else if (event.key === '=') {
        event.preventDefault()
        event.stopPropagation()
        fontsize.up()
      }
    }
  })
})
