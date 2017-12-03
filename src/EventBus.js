const bus = document.createElement('event-bus')
const { dispatchEvent } = bus
bus.dispatchEvent = (...args) => {
  console.log('The following event is dispatched: ', args[0].type, args)
  console.log('Event stack trace: ', new Error())
  return dispatchEvent.bind(bus)(...args)
}
"REMOVE"
window.bus = bus
export default bus
