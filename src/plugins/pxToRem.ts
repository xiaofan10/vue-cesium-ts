class Flexible {
  private root: HTMLElement = document.documentElement
  private dpr: number = window.devicePixelRatio || 1

  constructor() {
    this.setBodyFontSize()
    this.setRemUnit()
    this.adpt2Dpr()
    this.onEvents()
  }
  setRemUnit() {
    const { root: docEl } = this
    const rem = (docEl.clientWidth / 1920) * 16
    docEl.style.fontSize = rem + 'px'
  }
  setBodyFontSize() {
    if (document.body) {
      document.body.style.fontSize = 12 * this.dpr + 'px'
    } else {
      document.addEventListener('DOMContentLoaded', this.setBodyFontSize)
    }
  }
  onEvents() {
    window.addEventListener('resize', () => this.setRemUnit())
    window.addEventListener('pageshow', (e) => {
      if (e.persisted) {
        this.setRemUnit()
      }
    })
  }
  adpt2Dpr() {
    const { root: docEl, dpr } = this

    if (dpr >= 2) {
      const fakeBody = document.createElement('body')
      const testElement = document.createElement('div')
      testElement.style.border = '.5px solid transparent'
      fakeBody.appendChild(testElement)
      docEl.appendChild(fakeBody)
      if (testElement.offsetHeight === 1) {
        docEl.classList.add('hairlines')
      }
      docEl.removeChild(fakeBody)
    }
  }
}

export default Flexible
