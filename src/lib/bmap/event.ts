interface TEvents {
  [key: string]: any
}
class Event {
  events: TEvents = {}
  constructor() {}
  bind(event: string, fn: Function) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(fn)
  }
  unbind(event: string, fn: Function) {
    if (!this.events[event]) {
      return
    }

    if (!fn) {
      this.events[event] = []
      return
    }

    for (let i = 0; i < this.events[event].length; i++) {
      if (this.events[event][i] === fn) {
        this.events[event].splice(i, 1)
        break
      }
    }
  }

  emit(event: string, ...args: any[]) {
    if (!this.events[event]) {
      return
    }
    for (let i = 0; i < this.events[event].length; i++) {
      this.events[event][i](...args)
    }
  }
}

export default Event
