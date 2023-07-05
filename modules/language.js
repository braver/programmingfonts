import { Cookies } from './cookies.js'

export class Language {
  el = document.getElementById('select-language')

  init () {
    if (Cookies.get('language')) {
      this.el.value = Cookies.get('language')
    }
    this.el.onchange = () => {
      this.set()
    }
    this.set()
  }

  set () {
    const lang = this.el.value

    window.CMeditor.setOption('mode', lang.toLowerCase())
    Cookies.set('language', lang)
  }
}
