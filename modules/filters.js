export class Filters {
  filters = {
    style: false,
    rendering: false,
    liga: false,
    zerostyle: false,
    author: 'all',
    name: ''
  }

  fontData = {}

  constructor (data) {
    this.fontData = data
  }

  init () {
    document.getElementById('authors-list').onchange = (event) => {
      this.filters.author = event.target.value
      this.apply()
    }

    document.getElementById('name-search').onkeyup = (event) => {
      this.filters.name = event.target.value.toLowerCase()
      this.apply()
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

    document.querySelectorAll('.entry[data-alias]').forEach((element) => {
      const data = this.fontData[element.dataset.alias]
      if (
        (!this.filters.style || data.style === this.filters.style) &&
              (!this.filters.rendering || data.rendering === this.filters.rendering) &&
              (!this.filters.liga ||
                  (data.ligatures === false && this.filters.liga === 'no') ||
                  (data.ligatures === true && this.filters.liga === 'yes')) &&
              (!this.filters.zerostyle || data.zerostyle === this.filters.zerostyle) &&
              (this.filters.author === 'all' || data.author === this.filters.author) &&
              (!this.filters.name || data.name.toLowerCase().indexOf(this.filters.name) > -1)
      ) {
        element.classList.remove('filtered-out')
        count++
      } else {
        element.classList.add('filtered-out')
      }
    })

    this.setCounter(count)
  }
}
