const handleSymbol = Symbol('handleSymbol')
const eventsMap = Symbol('eventsMap')
class EventBus {
  constructor (vue) {
    if (!this[handleSymbol]) {
      Object.defineProperty(this, handleSymbol, {
        value: {},
        enumerable: false
      })
    }
    this.Vue = vue
    this[eventsMap] = {}
  }
  mapEventsToUid (uid, eventName) {
    this[eventsMap][uid] = this[eventsMap][uid] || []
    this[eventsMap][uid].push(eventName)
  }
  $on (eventName, callback, vm) {
    this[handleSymbol][eventName] = this[handleSymbol][eventName] || []
    this[handleSymbol][eventName].push(callback)
    if (vm instanceof this.Vue) this.mapEventsToUid(vm._uid, eventName)
  }
  $emit (...args) {
    const [eventName, ...params] = args
    const eventHandlers = this[handleSymbol][eventName] || []
    eventHandlers.forEach(fn => {
      fn(...params)
    })
  }
  $offByUid (uid) {
    let currentEvents = this[eventsMap][uid] || []
    currentEvents.forEach(event => {
      this.$off(event)
    })
    delete this[eventsMap][uid]
  }
  $off (eventName) {
    delete this[handleSymbol][eventName]
  }
}
let $EventBus = {}

$EventBus.install = (Vue, option) => {
  Vue.prototype.$eventBus = new EventBus(Vue)
  Vue.mixin({
    beforeDestroy () {
      this.$eventBus.$offByUid(this._uid)
    }
  })
}

export default $EventBus
