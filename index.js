
class EventBus {
  constructor (vue) {
    if (!this.handles) {
      Object.defineProperty(this, 'handles', {
        value: {},
        enumerable: false
      })
    }
    this.Vue = vue
    this.eventMapUid = {}
  }
  setEventMapUid (uid, eventName) {
    if (!this.eventMapUid[uid]) this.eventMapUid[uid] = []
    this.eventMapUid[uid].push(eventName)
  }
  $on (eventName, callback, vm) {
    if (!this.handles[eventName]) this.handles[eventName] = []
    this.handles[eventName].push(callback)
    if (vm instanceof this.Vue) this.setEventMapUid(vm._uid, eventName)
  }
  $emit () {
    // console.log('EventBus emit eventName===', eventName)
    let args = [...arguments]
    let eventName = args[0]
    let params = args.slice(1)
    if (this.handles[eventName]) {
      let len = this.handles[eventName].length
      for (let i = 0; i < len; i++) {
        this.handles[eventName][i](...params)
      }
    }
  }
  $offVmEvent (uid) {
    let currentEvents = this.eventMapUid[uid] || []
    currentEvents.forEach(event => {
      this.$off(event)
    })
  }
  $off (eventName) {
    delete this.handles[eventName]
  }
}

let $EventBus = {}

$EventBus.install = (Vue, option) => {
  Vue.prototype.$eventBus = new EventBus(Vue)
  Vue.mixin({
    beforeDestroy () {
      this.$eventBus.$offVmEvent(this._uid)
    }
  })
}

export default $EventBus
