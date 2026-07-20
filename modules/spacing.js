import { Cookies } from './cookies.js'

export class Spacing {
  el = document.getElementById('spacing')

  init () {
    if (Cookies.get('spacing')) {
      this.el.value = Cookies.get('spacing')
    }
    this.el.onchange = () => {
      this.set()
    }
    this.set()
  }

  set () {
    const spacing = this.el.value

    document.querySelector('.CodeMirror').style.lineHeight = spacing
    Cookies.set('spacing', spacing)
    window.CMeditor.refresh()
  }

  force (float) {
    this.el.value = float
    document.querySelector('.CodeMirror').style.lineHeight = float
    window.CMeditor.refresh()
  }

  reset () {
    if (Cookies.get('spacing')) {
      this.el.value = Cookies.get('spacing')
    } else {
      this.el.value = 1.4
    }
    this.el.dispatchEvent(new Event('change'));
  }
}
