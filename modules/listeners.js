import { Fontsize } from './fontsize.js'
import * as util from './util.js'

export class Listeners {
  walk (direction) {
    const activeEntry = document.querySelector('.entry.active')
    let target = null
    let next = direction === 'up' ? activeEntry.previousElementSibling : activeEntry.nextElementSibling

    while (target === null) {
      if (next) {
        if (next.matches('.entry:not(.hidden)')) {
          target = next
        } else {
          next = direction === 'up' ? next.previousElementSibling : next.nextElementSibling
        }
      } else {
        target = false
      }
    }

    if (target) {
      target.querySelector('a').focus()
      target.querySelector('a').click()
    }
  }

  init () {
    const fontsize = new Fontsize()
    fontsize.init()

    document.querySelector('.select-list').onkeydown = (event) => {
      if (event.ctrlKey || event.altKey || event.metaKey || event.shiftKey) {
        return
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        event.stopPropagation()
        this.walk('up')
      } else if (event.key === 'ArrowDown') {
        event.preventDefault()
        event.stopPropagation()
        this.walk('down')
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        event.stopPropagation()
        util.expandGroup()
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        event.stopPropagation()
        util.collapseGroup()
      }
    }

    document.body.addEventListener('keydown', (event) => {
      if (event.ctrlKey || event.metaKey) {
        if (event.key === '-') {
          event.preventDefault()
          event.stopPropagation()
          fontsize.down()
        } else if (event.key === '=') {
          event.preventDefault()
          event.stopPropagation()
          fontsize.up()
        }
      }
    })

    document.getElementById('compare-button').onclick = (event) => {
      event.preventDefault()
      event.stopPropagation()

      const original = document.querySelector('.codemirror-wrapper')
      const parent = original.parentNode

      parent.querySelector('.clone')?.remove()

      const clone = original.cloneNode(true)
      clone.classList.add('clone')

      clone.querySelector('section.config').remove()
      clone.querySelector('#compare-button').remove()

      const button = document.querySelector('#about-dialog button').cloneNode(true)
      button.setAttribute('id', 'close-button')
      button.onclick = (event) => {
        event.preventDefault()
        event.stopPropagation()
        clone.remove()
      }
      clone.appendChild(button)

      clone.querySelector('#code').setAttribute('id', 'clone-code')
      clone.querySelector('[for=code]').setAttribute('for', 'clone-code')

      parent.appendChild(clone)
    }

    document.querySelectorAll('dialog').forEach((dialog) => {
      dialog.querySelector('button').onclick = (event) => {
        event.preventDefault()
        event.stopPropagation()
        dialog.close()
      }

      document.querySelector('[aria-controls="' + dialog.id + '"]').onclick = (event) => {
        event.preventDefault()
        event.stopPropagation()
        dialog.showModal()
      }
    })
  }
}
