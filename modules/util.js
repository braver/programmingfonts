/* global CodeMirror */

import { Fontsize } from './fontsize.js'
import { Spacing } from './spacing.js'

const lang_count = {
    'Arabic': 48,
    'Armenian': 2,
    'Bamum': 1,
    'Bengali': 8,
    'Buginese': 1,
    'Burmese': 4,
    'Chakma': 1,
    'Cherokee': 1,
    'Chinese': 7,
    'Cree': 1,
    'Cyrillic': 93,
    'Devanagari': 15,
    'Georgian': 4,
    'Geʽez': 8,
    'Greek': 3,
    'Gujarati': 2,
    'Gurmukhi': 2,
    'Hangul': 1,
    'Hanja': 1,
    'Hanunoo': 1,
    'Hebrew': 5,
    'Hiragana': 2,
    'Inuktitut Syllabics': 1,
    'Kanji': 1,
    'Kannada': 1,
    'Katakana': 3,
    'Kayah Li': 2,
    'Khmer': 1,
    'Lao': 1,
    'Latin': 547,
    'Malayalam': 1,
    'Modern Yi': 1,
    'Ojibwe Syllabics': 1,
    'Oriya': 1,
    'Sinhala': 1,
    'Syriac': 1,
    'Tai Viet': 1,
    'Tamil': 1,
    'Telugu': 1,
    'Thaana': 1,
    'Thai': 1,
    'Tham': 1,
    'Tibetan': 3,
    'Tifinagh': 1,
    'Vai': 1,
}


const fontsize = new Fontsize()
const spacing = new Spacing()

function isVisible(el) {
  const container = document.querySelector('section.select-list').getBoundingClientRect()
  const target = el.getBoundingClientRect()

  return target.bottom > container.top && target.top < container.bottom
}

/**
 * Get the font from the # or the top-most entry
 */
function getFont() {
  let font = window.location.hash.substring(1)

  if (!font) {
    // Get the first visible entry's alias from the rendered list
    const first = document.querySelector('#select-font .entry:not(.hidden)')
    font = first ? first.getAttribute('data-alias') : null
  }

  return font
}

function writeVariants(variants) {
  if (typeof variants === 'string') {
    return variants
  }
  if (variants && variants.length > 0) {
    return variants.join(', ')
  }
  return ''
}

window.revealLangs = (event) => {
  console.log(event)
  event.preventDefault()
  event.stopPropagation()
  const parent = event.target.parentNode
  const btn = event.target
  const more = btn.dataset.more
  console.log(parent, btn, more)
  btn.remove()
  parent.textContent = parent.textContent + more
}

function writeCoverage(data) {
  let chars = `${data.glyphs} glyphs`
  if (data.characters) {
    chars += `, ${data.characters} characters. `
  }

  let langs = []

  Object.keys(data.languages ?? {}).forEach((lang, index) => {
    const count = data.languages[lang]
    const total = lang_count[lang]
    const suffix = index === 0 ? ' languages' : ''
    if (count < total) {
      lang += ` (${count} of ${total}${suffix})`
    }
    langs.push(lang)
  })

  if (langs.length > 6) { // if there are 6 or more, show only the first 4 (avoiding hiding only one)
    chars += langs.slice(0,4).join(', ')
    const remaining = langs.slice(4,langs.length).join(', ')
    chars += `, <button onclick="revealLangs(event)" title="Reveal all ${langs.length}" data-more="${remaining}">+${langs.length - 4}&hellip;</button>`
  } else {
    chars += langs.join(', ')
    chars += '.'
  }

  return chars
}

export function setDetails (data) {
  const box = document.querySelector('.info-wrapper')
  box.querySelector('h2 .name').textContent = data.name
  box.querySelector('h2 .license').textContent = data.license
  box.querySelector('.variants + dd').textContent = writeVariants(data.variants)
  box.querySelector('.coverage + dd').innerHTML = writeCoverage(data)
  box.querySelector('.website + dd a').href = data.website
  box.querySelector('.website + dd a').textContent = data.website

  let desc = data.description ?? ''
  if (data.huge ?? false) {
    desc += '<br><small>Note: this font is very large and might take a while to load.</small>'
  }
  box.querySelector('.info').innerHTML = desc
}

// ProgrammingFonts font selector
export function selectFont () {
  const codeMirror = document.querySelector('.CodeMirror')
  const font = getFont()
  const data = window.fontData

  if (typeof data === 'undefined' || typeof data[font] === 'undefined') {
    return
  }

  setDetails(data[font])
  codeMirror.setAttribute('data-font', font)

  // forced rendering parameters for bitmap fonts
  data[font].rendering === 'bitmap' ? codeMirror.classList.add('no-smooth') : codeMirror.classList.remove('no-smooth')
  data[font]['bitmap size'] ? fontsize.force(data[font]['bitmap size']) : fontsize.reset()
  data[font]['bitmap height'] ? spacing.force(data[font]['bitmap height']) : spacing.reset()

  codeMirror.style.fontFamily = `${font}, monospace`
  codeMirror.querySelectorAll('pre, textarea').forEach((element) => {
    element.style.fontFamily = `${font}, monospace`
  })

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
}

export function expandGroup () {
  const activeEntry = document.querySelector('.entry.active')
  if (!activeEntry || activeEntry.classList.contains('group-child')) {
    return
  }
  if (activeEntry.querySelector('.group-toggle') && !activeEntry.classList.contains('group-open')) {
    window.toggleGroup(activeEntry.getAttribute('data-alias'))
  }
}

export function collapseGroup () {
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

const dateAddedKey = (v) => v.added === 'bc' ? String(v.year) : v.added

export function compare(a, b, mode) {
  switch (mode) {
    case 'newest': {
      const yearDiff = b.year - a.year
      return yearDiff !== 0 ? yearDiff : dateAddedKey(b).localeCompare(dateAddedKey(a))
    }
    case 'oldest': {
      const yearDiff = a.year - b.year
      return yearDiff !== 0 ? yearDiff : dateAddedKey(a).localeCompare(dateAddedKey(b))
    }
    case 'author': {
      const authorDiff = a.author.toLowerCase().localeCompare(b.author.toLowerCase())
      return authorDiff !== 0 ? authorDiff : a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    }
    case 'name':
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    case 'added':
    default:
      return dateAddedKey(b).localeCompare(dateAddedKey(a))
  }
}

export function initEditor() {
  window.CMeditor = CodeMirror.fromTextArea(document.getElementById('code'), {
    lineNumbers: true,
    styleActiveLine: true,
    matchBrackets: true,
    theme: 'pastel-on-dark',
    lineWrapping: true
  })
}
