import * as util from './util.js'

export class Filters {
  filters = {
    style: false,
    rendering: false,
    liga: false,
    zerostyle: false,
    name: ''
  }

  fontData = {}

  constructor (data, renderCallback) {
    this.fontData = data
    this.renderCallback = renderCallback

    const stored_filters = JSON.parse(localStorage.getItem('filters') ?? '{}')
    if (Object.keys(stored_filters).length) {
      this.filters = {...this.filters, ...stored_filters}
    }
  }

  init () {
    const sortSelect = document.getElementById('sort-list')
    sortSelect.onchange = () => {
      localStorage.setItem('sort-mode', sortSelect.value)
      this.renderCallback()  // rerender in the new sort order
      this.apply()           // re-apply filtering
      util.selectFont()      // re-select current font
    }

    document.getElementById('name-search').onkeyup = (event) => {
      this.filters.name = event.target.value.toLowerCase()
      this.apply()
    }

    if (this.filters.name) {
      document.getElementById('name-search').value = this.filters.name
    }

    document
      .getElementById('filters')
      .querySelectorAll('button')
      .forEach((button) => {
        button.onclick = (event) => {
          event.preventDefault()
          event.stopPropagation()
          this.toggle(button.value)
        }
      })

    this.apply()
  }

  toggle (filter) {
    // cycle through the possible values for each filter
    // and set the filters[filter] value,
    // or at the end of the cycle set it to false
    const options = {
      style: [false, 'sans', 'serif'],
      rendering: [false, 'vector', 'bitmap'],
      liga: [false, 'yes', 'no'],
      zerostyle: [false, 'slashed', 'dotted', 'empty']
    }

    const index = options[filter].indexOf(this.filters[filter])
    const next = index + 1
    if (next < options[filter].length) {
      this.filters[filter] = options[filter][next]
    } else {
      this.filters[filter] = options[filter][0]
    }

    this.apply()
  }

  setCounter (amount) {
    const element = document.querySelector('h1 a:first-child')
    if (amount === 1) {
      element.innerHTML = `${amount} Programming Font`
    } else {
      element.innerHTML = `${amount} Programming Fonts`
    }
  }

  apply () {
    let count = 0

    localStorage.setItem('filters', JSON.stringify(this.filters))

    Object.keys(this.filters).forEach((filter) => {
      const button = document.querySelector(`button[value="${filter}"]`)
      if (!button) {
        return
      }
      if (this.filters[filter]) {
        button.classList.add('selected')
        button.querySelectorAll('svg').forEach((image) => {
          image.classList.remove('selected')
        })
        button.querySelector(`svg[alt="${this.filters[filter]}"]`).classList.add('selected')
      } else {
        button.classList.remove('selected')
        button.querySelectorAll('svg').forEach((image) => {
          image.classList.remove('selected')
        })
      }
    })

    const nameMatches = (data) => (
      !this.filters.name ||
      data.name.toLowerCase().indexOf(this.filters.name) > -1 ||
      data.author.toLowerCase().indexOf(this.filters.name) > -1 ||
      data.year.toString().indexOf(this.filters.name) > -1
    )

    document.querySelectorAll('.entry[data-alias]').forEach((element) => {
      const data = this.fontData[element.dataset.alias]
      const isChild = !!element.dataset.group

      if (
        (!this.filters.style || data.style === this.filters.style) &&
              (!this.filters.rendering || data.rendering === this.filters.rendering) &&
              (!this.filters.liga ||
                  (data.ligatures === false && this.filters.liga === 'no') ||
                  (data.ligatures === true && this.filters.liga === 'yes')) &&
              (!this.filters.zerostyle || data.zerostyle === this.filters.zerostyle) &&
              (isChild || nameMatches(data))
      ) {
        element.classList.remove('filtered-out')
        if (!isChild) count++
      } else {
        element.classList.add('filtered-out')
      }
    })

    document.querySelectorAll('.entry[data-alias]:not([data-group]).filtered-out').forEach((parent) => {
      const parentData = this.fontData[parent.dataset.alias]
      if (!nameMatches(parentData)) return
      const hasVisibleChild = !!document.querySelector(`.entry.group-child[data-group='${parent.dataset.alias}']:not(.filtered-out)`)
      if (hasVisibleChild) {
        parent.classList.remove('filtered-out')
        count++
      }
    })

    document.querySelectorAll('.entry.group-child:not(.filtered-out)').forEach((child) => {
      const parentData = this.fontData[child.dataset.group]
      if (parentData && !nameMatches(parentData)) {
        child.classList.add('filtered-out')
      }
    })

    this.setCounter(count)
  }
}
