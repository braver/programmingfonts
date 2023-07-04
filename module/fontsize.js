import { Cookies } from './cookies.js'

export default class Fontsize {
  el = document.getElementById('size')

  init () {
    this.el.onchange = () => {
      this.set()
    }
    this.set()
  }

  up () {
    const sizeEl = this.el
    sizeEl.value = Number(sizeEl.value) + 1
    sizeEl.onchange()
  }

  down () {
    const sizeEl = this.el
    sizeEl.value = Number(sizeEl.value) - 1
    sizeEl.onchange()
  }

  set () {
    const size = this.el.value
    document.querySelector('.CodeMirror').style.fontSize = `${size}px`
    Cookies.set('size', size)
    window.CMeditor.refresh()
  }

  forceSize (px) {
    this.el.value = px
    document.querySelector('.CodeMirror').style.fontSize = `${px}px`
    window.CMeditor.refresh()
  }

  reset () {
    if (Cookies.get('size')) {
      this.forceSize(Cookies.get('size'))
    } else {
      this.forceSize('16')
    }
  }
}
