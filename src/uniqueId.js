import EventBus from './EventBus'
import getState from './store'
import requestNewId from './actions/requestNewId'
export default () => {
  EventBus.dispatchEvent(requestNewId())
  return getState().id
}
