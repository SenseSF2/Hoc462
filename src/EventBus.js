const bus = document.createElement('event-bus')
const { dispatchEvent } = bus
let events = []
bus.dispatchEvent = (...args) => {
  events = [...events, { type: args[0].type, detail: args[0].detail }]
  console.log('The following event is dispatched: ', args[0].type, args)
  console.log('Event stack trace: ', new Error())
  return dispatchEvent.bind(bus)(...args)
}
window.bus = bus
const getEvents = () => events
export default bus
export { getEvents }
