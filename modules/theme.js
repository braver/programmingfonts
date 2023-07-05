import { Cookies } from './cookies.js'

export class Theme {
  el = document.getElementById('select-theme')

  init () {
    if (Cookies.get('theme')) {
      this.el.value = Cookies.get('theme')
    }
    this.el.onchange = () => {
      this.set()
    }
    this.set()

    document.getElementById('theme-next').onclick = () => {
      this.walk('down')
    }

    document.getElementById('theme-previous').onclick = () => {
      this.walk('up')
    }
  }

  set () {
    let theme = 'oceanic-next'

    if (this.el.selectedIndex > -1) {
      theme = this.el.options[this.el.selectedIndex].textContent
    }
    window.CMeditor.setOption('theme', theme)
    Cookies.set('theme', theme)
  }

  walk (direction) {
    const current = this.el.selectedOptions[0]
    let next
    if (current) {
      next = direction === 'up' ? current.previousElementSibling : current.nextElementSibling
    }
    if (next) {
      this.el.value = next.value
    }
    this.set()
  }
}
