/* global CodeMirror */

import { Cookies } from './modules/cookies.js'
import { Fontsize } from './modules/fontsize.js'
import { Filters } from './modules/filters.js'
import { Language } from './modules/language.js'
import { Spacing } from './modules/spacing.js'
import { Theme } from './modules/theme.js'

const defaultFont = 'md-io'
const fontsize = new Fontsize()

let fontData

window.CMeditor = CodeMirror.fromTextArea(document.getElementById('code'), {
  lineNumbers: true,
  styleActiveLine: true,
  matchBrackets: true,
  theme: 'pastel-on-dark',
  lineWrapping: true
})

function isVisible (el) {
  const container = document.querySelector('section.select-list').getBoundingClientRect()
  const target = el.getBoundingClientRect()

  return target.bottom > container.top && target.top < container.bottom
}

/**
 * Get the font from the #, the cookie, or a default
 */
function getFont () {
  let font = window.location.hash.substring(1)

  if (!font) {
    font = Cookies.get('font')
  }

  if (!font) {
    font = defaultFont
  }

  return font
}

function setDetails (data) {
  const box = document.querySelector('.info-wrapper')
  box.querySelector('h2').setAttribute('data-license', data.license ?? '')
  box.querySelector('a').href = data.website
  box.querySelector('h2 a').textContent = data.name
  box.querySelector('p.info').textContent = data.description ?? ''
  if (typeof data.variants === 'string') {
    box.querySelector('p.variants').textContent = data.variants
  } else if (data.variants && data.variants.length > 1) {
    box.querySelector('p.variants').textContent = data.variants.join(', ')
  } else {
    box.querySelector('p.variants').textContent = ''
  }
}

// ProgrammingFonts font selector
function selectFont () {
  const codeMirror = document.querySelector('.CodeMirror')
  const font = getFont()

  if (typeof fontData === 'undefined' || typeof fontData[font] === 'undefined') {
    return
  }

  setDetails(fontData[font])
  codeMirror.setAttribute('data-font', font)

  if (fontData[font].rendering === 'bitmap') {
    codeMirror.classList.add('no-smooth')
    if (fontData[font]['bitmap size']) {
      fontsize.forceSize(fontData[font]['bitmap size'])
    }
  } else {
    codeMirror.classList.remove('no-smooth')
    fontsize.reset()
  }

  if (font === 'input') {
    // because Input Mono is loaded via external @font-face file
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

  const activeEntry = document.querySelector(`#select-font [data-alias='${font}']`)
  if (activeEntry) {
    if (activeEntry.classList.contains('group-child')) {
      const groupAlias = activeEntry.getAttribute('data-group')
      const primary = document.querySelector(`#select-font [data-alias='${groupAlias}']`)
      if (primary && !primary.classList.contains('group-open')) {
        window.toggleGroup(groupAlias)
      }
    }
    activeEntry.classList.add('active')
    if (!isVisible(activeEntry)) {
      activeEntry.scrollIntoView({
        block: 'center',
        inline: 'nearest',
        behavior: 'smooth'
      })
    }
  }

  Cookies.set('font', font)
}

const chevronDownIcon = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M12.78 5.22a.749.749 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.06 0L3.22 6.28a.749.749 0 1 1 1.06-1.06L8 8.939l3.72-3.719a.749.749 0 0 1 1.06 0Z"/></svg>'

window.toggleGroup = (alias) => {
  const primary = document.querySelector(`#select-font [data-alias='${alias}']`)
  const isExpanded = primary.classList.toggle('group-open')
  document.querySelectorAll(`#select-font [data-group='${alias}']`).forEach((child) => {
    child.classList.toggle('group-child-visible', isExpanded)
  })
}

function renderSelectList () {
  const icon =
        '<svg class="octicon" viewBox="0 0 12 14" version="1.1" width="12" height="14" aria-hidden="true"><path fill-rule="evenodd" d="M11 10h1v3c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V3c0-.55.45-1 1-1h3v1H1v10h10v-3zM6 2l2.25 2.25L5 7.5 6.5 9l3.25-3.25L12 8V2H6z"></path></svg>'
  const pinIcon =
        '<svg class="octicon octicon-pin" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10 1.2V2l.5 1L6 6H2.2c-.44 0-.67.53-.34.86L5 10l-4 5 5-4 3.14 3.14a.5.5 0 0 0 .86-.34V10l3-4.5 1 .5h.8c.44 0 .67-.53.34-.86L10.86.86a.5.5 0 0 0-.86.34z"></path></svg>'
  let favoritesMap = {}
  let favorites = []

  document.getElementById('select-font').innerHTML = ''

  try {
    favorites = JSON.parse(localStorage.getItem('favorites')) || []
    favoritesMap = favorites.reduce((acc, alias) => {
      acc[alias] = true
      return acc
    }, {})
  } catch (err) {
    console.error('could not render favorites', err)
  }

  const renderAuthors = (authors) => {
    authors.sort()
    authors.forEach((author) => {
      const option = document.createElement('option')
      option.innerHTML = author
      document.getElementById('authors-list').querySelector('.other').appendChild(option)
    })
  }

  const renderFonts = (fonts) => {
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

    const groups = {}
    fonts.forEach((v) => {
      if (v.group && v.group !== v.alias) {
        if (!groups[v.group]) groups[v.group] = []
        groups[v.group].push(v)
      }
    })
    const groupChildAliases = new Set(
      fonts.filter((v) => v.group && v.group !== v.alias).map((v) => v.alias)
    )

    fonts.filter((v) => !groupChildAliases.has(v.alias)).forEach((v) => {
      const option = document.createElement('div')

      option.classList.add('entry')
      option.setAttribute('data-alias', v.alias)

      if (favoritesMap[v.alias]) {
        option.classList.add('pinned')
      }

      const childList = groups[v.alias] || []
      const chevron = childList.length > 0
        ? `<button title="Alternatives" class="group-toggle" onclick="toggleGroup('${v.alias}')">+${childList.length} ${chevronDownIcon}</button>`
        : ''

      option.innerHTML = `
        <a href="#${v.alias}" data-style="${v.style}">
          <span class="name">${v.name}</span>
          <span class="details">${v.year} — ${v.author}</span>
        </a>
        ${chevron}
        <a class="favoritelink" title="Favourite" onclick="toggleFavorite('${v.alias}')">${pinIcon}</a>
        ${v.website ? `<a class="website" href="${v.website}" rel="external"> <span>Website</span>${icon}</a>` : ''}
      `

      document.getElementById('select-font').appendChild(option)

      childList.forEach((child) => {
        const childOption = document.createElement('div')

        childOption.classList.add('entry', 'group-child')
        childOption.setAttribute('data-alias', child.alias)
        childOption.setAttribute('data-group', v.alias)

        childOption.innerHTML = `
          <a href="#${child.alias}" data-style="${child.style}">
            <span class="name">${child.name}</span>
            <span class="details">${child.year} — ${child.author}</span>
          </a>
          ${child.website ? `<a class="website" href="${child.website}" rel="external"> <span>Website</span>${icon}</a>` : ''}
        `

        document.getElementById('select-font').appendChild(childOption)
      })
    })
  }

  fetch('fonts.json')
    .then((response) => {
      if (response.ok) {
        return response.json()
      } else {
        console.error(response.status + ': ' + response.statusText)
      }
    }).then((data) => {
      const fonts = []
      const authors = []

      fontData = data

      Object.keys(data).forEach((key) => {
        const v = data[key]
        v.alias = key
        fonts.push(v)
        if (authors.indexOf(v.author) < 0) {
          authors.push(v.author)
        }
      })

      renderAuthors(authors)
      renderFonts(fonts)
      selectFont()
      new Filters(data).init()
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
  renderSelectList()
  return false
}

function walk (direction) {
  const activeEntry = document.querySelector('.entry.active')
  let target = null
  let next = direction === 'up' ? activeEntry.previousElementSibling : activeEntry.nextElementSibling

  while (target === null) {
    if (next) {
      if (next.matches('.entry:not(.filtered-out):not(.group-child), .entry.group-child.group-child-visible:not(.filtered-out)')) {
        target = next
      } else {
        next = direction === 'up' ? next.previousElementSibling : next.nextElementSibling
      }
    } else {
      target = false
    }
  }

  if (target) {
    target.querySelector('a').click()
  }
}

function expandGroup () {
  const activeEntry = document.querySelector('.entry.active')
  if (!activeEntry || activeEntry.classList.contains('group-child')) {
    return
  }
  if (activeEntry.querySelector('.group-toggle') && !activeEntry.classList.contains('group-open')) {
    window.toggleGroup(activeEntry.getAttribute('data-alias'))
  }
}

function collapseGroup () {
  const activeEntry = document.querySelector('.entry.active')
  if (!activeEntry) {
    return
  }
  if (activeEntry.classList.contains('group-child')) {
    const primary = document.querySelector(`#select-font [data-alias='${activeEntry.getAttribute('data-group')}']`)
    if (primary) {
      primary.querySelector('a').click()
    }
  } else if (activeEntry.classList.contains('group-open')) {
    window.toggleGroup(activeEntry.getAttribute('data-alias'))
  }
}

window.onhashchange = () => {
  selectFont()
}

window.addEventListener('DOMContentLoaded', () => {
  renderSelectList()
  fontsize.init()
  new Theme().init()
  new Spacing().init()
  new Language().init()

  document.querySelector('.select-list').onkeydown = (event) => {
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
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      event.stopPropagation()
      expandGroup()
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      event.stopPropagation()
      collapseGroup()
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

  document.getElementById('compare-button').onclick = (event) => {
    event.preventDefault()
    event.stopPropagation()

    const original = event.target.closest('.codemirror-wrapper')
    const parent = original.parentNode

    parent.querySelector('.clone')?.remove()

    const clone = original.cloneNode(true)
    clone.classList.add('clone')

    const button = clone.querySelector('#compare-button')
    button.setAttribute('id', 'close-button')
    button.innerText = 'Close'
    button.onclick = (event) => {
      event.preventDefault()
      event.stopPropagation()
      clone.remove()
    }

    clone.querySelector('#code').setAttribute('id', 'clone-code')
    clone.querySelector('[for=code]').setAttribute('for', 'clone-code')

    parent.appendChild(clone)
  }

  document.querySelectorAll('dialog').forEach((dialog) => {
    dialog.querySelector('button').onclick = (event) => {
      event.preventDefault()
      event.stopPropagation()
      dialog.close()
    }

    document.querySelector('[aria-controls="' + dialog.id + '"]').onclick = (event) => {
      event.preventDefault()
      event.stopPropagation()
      dialog.showModal()
    }
  })
})
