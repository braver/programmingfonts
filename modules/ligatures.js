import { Cookies } from './cookies.js'

export class Ligatures {
  el = document.querySelector('#liga-toggle')
  enabled = true

  init () {
    if (Cookies.get('ligatures')) {
      this.enabled = Cookies.get('ligatures') === 'true'
    }

    this.el.onclick = (event) => {
      event.preventDefault()
      event.stopPropagation()
      this.toggle()
    }

    window.CMeditor.on('renderLine', () => {
      this.setLigatures(this.enabled)
    })

    this.set()
  }

  toggle () {
    this.enabled = !this.enabled
    this.set()
  }

  set () {
    requestAnimationFrame(() => {
      this.setLigatures(this.enabled)
    })

    window.CMeditor.refresh()

    Cookies.set('ligatures', this.enabled)

    if (this.enabled) {
      this.el.classList.add('selected')
      this.el.querySelector('svg[alt="yes"]').classList.add('selected')
      this.el.querySelector('svg[alt="no"]').classList.remove('selected')
    } else {
      this.el.classList.remove('selected')
      this.el.querySelector('svg[alt="yes"]').classList.remove('selected')
      this.el.querySelector('svg[alt="no"]').classList.add('selected')
    }
  }

  setLigatures (enabled) {
    document.querySelectorAll('.CodeMirror pre').forEach(pre => {
      pre.style.setProperty('font-variant-ligatures', enabled ? 'normal' : 'none')
    })
  }
}
