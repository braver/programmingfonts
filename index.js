/* global CodeMirror window document Set plausible */
/* eslint-disable no-implicit-globals */

// CodeMirror
const editor = CodeMirror.fromTextArea(document.getElementById('code'), {
  lineNumbers: true,
  styleActiveLine: true,
  matchBrackets: true,
  theme: 'pastel-on-dark',
  lineWrapping: true
})

// CodeMirror theme selector
const input = document.getElementById('select-theme')

let fontData
const filters = {
  style: false,
  rendering: false,
  liga: false,
  zerostyle: false,
  author: 'all',
  name: ''
}

const selectTheme = () => {
  let theme = 'oceanic-next'

  if (input.selectedIndex > -1) {
    theme = input.options[input.selectedIndex].textContent
  }
  editor.setOption('theme', theme)
  document.cookie = `theme=${theme};max-age=172800`
}

// ProgrammingFonts font selector
const selectFont = () => {
  let font = window.location.hash.substring(1)
  const msg = document.querySelector('footer .subtitle')
  const codeMirror = document.querySelector('.CodeMirror')

  if (!font) {
    font = 'source-code-pro'
    msg.innerHTML = 'Test drive all the programming fonts!'
  } else if (typeof fontData !== 'undefined') {
    msg.innerHTML = `Test drive <a rel="external" href="${fontData[font].website}">${fontData[font].name}!</a>`
  }

  if (typeof fontData !== 'undefined' && fontData[font].rendering === 'bitmap') {
    codeMirror.classList.add('no-smooth')
  } else {
    codeMirror.classList.remove('no-smooth')
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

  document.cookie = `font=${font};max-age=172800`
}

window.onhashchange = () => {
  plausible('Font Selected')
  selectFont()
}

function setSize () {
  const size = document.getElementById('size').value

  document.querySelector('.CodeMirror').style.fontSize = `${size}px`
  document.cookie = `size=${size};max-age=172800`
  editor.refresh()
}
function setSpacing () {
  const spacing = document.getElementById('spacing').value

  document.querySelector('.CodeMirror').style.lineHeight = spacing
  document.cookie = `spacing=${spacing};max-age=172800`
  editor.refresh()
}
function selectLanguage () {
  const lang = document.getElementById('select-language').value

  editor.setOption('mode', lang.toLowerCase())
  document.cookie = `language=${lang};max-age=172800`
}
function setCounter (amount) {
  const element = document.querySelector('h1 a:first-child')
  if (amount === 1) {
    element.innerHTML = `${amount} Programming Font`
  } else {
    element.innerHTML = `${amount} Programming Fonts`
  }
}

function applyFilters () {
  let count = 0

  Object.keys(filters).forEach((filter) => {
    const button = document.querySelector(`button[value="${filter}"]`)
    if (!button) {
      return
    }
    if (filters[filter]) {
      button.classList.add('selected')
      button.querySelectorAll('svg').forEach((image) => {
        image.classList.remove('selected')
      })
      button.querySelector(`svg[alt="${filters[filter]}"]`).classList.add('selected')
    } else {
      button.classList.remove('selected')
      button.querySelectorAll('svg').forEach((image) => {
        image.classList.remove('selected')
      })
    }
  })

  document.querySelectorAll('.entry[data-alias]').forEach((element) => {
    const data = fontData[element.dataset.alias]
    if (
      (!filters.style || data.style === filters.style) &&
            (!filters.rendering || data.rendering === filters.rendering) &&
            (!filters.liga ||
                (data.ligatures === false && filters.liga === 'no') ||
                (data.ligatures === true && filters.liga === 'yes')) &&
            (!filters.zerostyle || data.zerostyle === filters.zerostyle) &&
            (filters.author === 'all' || data.author === filters.author) &&
            (!filters.name || data.name.toLowerCase().indexOf(filters.name) > -1)
    ) {
      element.classList.remove('filtered-out')
      count++
    } else {
      element.classList.add('filtered-out')
    }
  })

  setCounter(count)
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
    applyFilters()
  }
  ajax.responseType = 'json'
  ajax.open('GET', 'fonts.json', true)
  ajax.send()
}

// eslint-disable-next-line no-unused-vars
function toggleFavorite (alias) {
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

function increaseFontSize () {
  const sizeEl = document.getElementById('size')
  sizeEl.value = Number(sizeEl.value) + 1
  sizeEl.onchange()
}

function decreaseFontSize () {
  const sizeEl = document.getElementById('size')
  sizeEl.value = Number(sizeEl.value) - 1
  sizeEl.onchange()
}

function toggleFilter (filter) {
  // cycle through the possible values for each filter
  // and set the filters[filter] value,
  // or at the end of the cycle set it to false
  const options = {
    style: [false, 'sans', 'serif'],
    rendering: [false, 'vector', 'bitmap'],
    liga: [false, 'yes', 'no'],
    zerostyle: [false, 'slashed', 'dotted', 'empty']
  }

  const index = options[filter].indexOf(filters[filter])
  const next = index + 1
  if (next < options[filter].length) {
    filters[filter] = options[filter][next]
  } else {
    filters[filter] = options[filter][0]
  }

  applyFilters()
}

window.addEventListener('DOMContentLoaded', () => {
  const cookieValueSpacing = document.cookie.replace(/(?:(?:^|.*;\s*)spacing\s*=\s*([^;]*).*$)|^.*$/, '$1')
  const cookieValueSize = document.cookie.replace(/(?:(?:^|.*;\s*)size\s*=\s*([^;]*).*$)|^.*$/, '$1')
  const cookieValueTheme = document.cookie.replace(/(?:(?:^|.*;\s*)theme\s*=\s*([^;]*).*$)|^.*$/, '$1')
  const cookieValueLanguage = document.cookie.replace(/(?:(?:^|.*;\s*)language\s*=\s*([^;]*).*$)|^.*$/, '$1')

  if (cookieValueSpacing !== '') {
    document.getElementById('spacing').value = cookieValueSpacing
  }
  if (cookieValueSize !== '') {
    document.getElementById('size').value = cookieValueSize
  }
  if (cookieValueTheme !== '') {
    document.getElementById('select-theme').value = cookieValueTheme
  }
  if (cookieValueLanguage !== '') {
    document.getElementById('select-language').value = cookieValueLanguage
  }

  renderSelectList()
  selectTheme()
  setSize()
  setSpacing()
  selectLanguage()

  function walkThemes (direction) {
    const select = document.getElementById('select-theme')
    const current = select.selectedOptions[0]
    let next
    if (current) {
      next = direction === 'up' ? current.previousElementSibling : current.nextElementSibling
    }
    if (next) {
      select.value = next.value
    }
    selectTheme()
  }

  document.getElementById('theme-next').onclick = () => {
    walkThemes('down')
  }

  document.getElementById('theme-previous').onclick = () => {
    walkThemes('up')
  }

  document
    .getElementById('filters')
    .querySelectorAll('button')
    .forEach((button) => {
      button.onclick = (event) => {
        event.preventDefault()
        event.stopPropagation()
        toggleFilter(button.value)
      }
    })

  document.getElementById('authors-list').onchange = (event) => {
    filters.author = event.target.value
    applyFilters()
  }

  document.getElementById('name-search').onkeyup = (event) => {
    filters.name = event.target.value.toLowerCase()
    applyFilters()
  }

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
        decreaseFontSize()
      } else if (event.key === '=') {
        event.preventDefault()
        event.stopPropagation()
        increaseFontSize()
      }
    }
  })
})
