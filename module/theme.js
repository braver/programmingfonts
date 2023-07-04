import { Cookies } from './cookies.js'

export default class Theme {
  el = document.getElementById('select-theme')

  init () {
    this.el.onchange = () => {
      this.set()
    }
    this.set()
  }

  set () {
    let theme = 'oceanic-next'

    if (this.el.selectedIndex > -1) {
      theme = this.el.options[this.el.selectedIndex].textContent
    }
    window.CMeditor.setOption('theme', theme)
    Cookies.set('theme', theme)
  }
}
