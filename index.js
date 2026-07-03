/* global CodeMirror */

import { Fontsize } from './modules/fontsize.js'
import { Filters } from './modules/filters.js'
import { Language } from './modules/language.js'
import { Spacing } from './modules/spacing.js'
import { Theme } from './modules/theme.js'
import * as util from './modules/util.js'

const fontsize = new Fontsize()

window.CMeditor = CodeMirror.fromTextArea(document.getElementById('code'), {
  lineNumbers: true,
  styleActiveLine: true,
  matchBrackets: true,
  theme: 'pastel-on-dark',
  lineWrapping: true
})

const chevronDownIcon = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M12.78 5.22a.749.749 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.06 0L3.22 6.28a.749.749 0 1 1 1.06-1.06L8 8.939l3.72-3.719a.749.749 0 0 1 1.06 0Z"/></svg>'

window.toggleGroup = (alias) => {
  const primary = document.querySelector(`#select-font [data-alias='${alias}']`)
  const isExpanded = primary.classList.toggle('group-open')
  document.querySelectorAll(`#select-font [data-group='${alias}']`).forEach((child) => {
    child.classList.toggle('group-child-visible', isExpanded)
  })
}

function renderSelectList (selectFirst = false) {
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

  const renderFonts = (fonts) => {
    const sortMode = document.getElementById('sort-list').value
    const dateAddedKey = (v) => v.added === 'bc' ? String(v.year) : v.added

    function compare(a, b) {
      switch (sortMode) {
        case 'newest':
          return b.year - a.year
        case 'oldest':
          return a.year - b.year
        case 'author': {
          const authorDiff = a.author.toLowerCase().localeCompare(b.author.toLowerCase())
          return authorDiff !== 0 ? authorDiff : a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        }
        case 'name':
          return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        case 'date-added':
        default:
          return dateAddedKey(b).localeCompare(dateAddedKey(a))
      }
    }

    fonts.sort((a, b) => {
      if (favoritesMap[a.alias] && !favoritesMap[b.alias]) {
        return -1
      }
      if (!favoritesMap[a.alias] && favoritesMap[b.alias]) {
        return 1
      }
      return compare(a, b)
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

      window.fontData = data

      Object.keys(data).forEach((key) => {
        const v = data[key]
        v.alias = key
        fonts.push(v)
      })

      renderFonts(fonts)
      new Filters(data, () => {renderSelectList(true)}).init()

      if (selectFirst) {
        const first = util.getFirstEntryAlias()
        if (first) {
          window.location.hash = first
        }
      }
      util.selectFont()
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

window.onhashchange = () => {
  util.selectFont()
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
      util.expandGroup()
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      event.stopPropagation()
      util.collapseGroup()
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
