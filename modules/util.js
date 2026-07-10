import { Fontsize } from './fontsize.js'

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

function isVisible (el) {
  const container = document.querySelector('section.select-list').getBoundingClientRect()
  const target = el.getBoundingClientRect()

  return target.bottom > container.top && target.top < container.bottom
}

/**
 * Get the font from the # or the top-most entry
 */
function getFont () {
  let font = window.location.hash.substring(1)

  if (!font) {
    font = getFirstEntryAlias()
  }

  return font
}

/**
 * Get the first visible (non-filtered) entry's alias from the rendered list
 */
export function getFirstEntryAlias () {
  const first = document.querySelector('#select-font .entry:not(.filtered-out):not(.group-child)')
  return first ? first.getAttribute('data-alias') : null
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

function writeCoverage(data) {
  let chars = `${data.glyphs} glyphs, ${data.characters} characters. `
  let langs = []

  Object.keys(data.languages).forEach((lang) => {
    const count = data.languages[lang]
    const total = lang_count[lang]
    if (count < total) {
      lang += ` (${count} of ${total} languages)`
    }
    langs.push(lang)
  })
  chars += langs.join(', ')
  chars += '.'
  return chars
}

export function setDetails (data) {
  const box = document.querySelector('.info-wrapper')
  box.querySelector('h2').setAttribute('data-license', data.license ?? '')
  box.querySelectorAll('a').forEach((link) => {
    link.href = data.website
  });
  box.querySelector('h2 a').textContent = data.name
  box.querySelector('p a').textContent = data.website
  box.querySelector('p.info').textContent = data.description ?? ''
  box.querySelector('p.variants').textContent = writeVariants(data.variants)
  box.querySelector('p.coverage').textContent = writeCoverage(data)
}

// ProgrammingFonts font selector
export function selectFont () {
  const codeMirror = document.querySelector('.CodeMirror')
  const font = getFont()

  if (typeof fontData === 'undefined' || typeof window.fontData[font] === 'undefined') {
    return
  }

  setDetails(window.fontData[font])
  codeMirror.setAttribute('data-font', font)

  if (window.fontData[font].rendering === 'bitmap') {
    codeMirror.classList.add('no-smooth')
    if (window.fontData[font]['bitmap size']) {
      fontsize.forceSize(window.fontData[font]['bitmap size'])
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
