import EventBus from '../EventBus'
export default ({ getState, setState }) => {
  EventBus.addEventListener('drawer-tab-selected', ({ detail: { name } }) => {
    setState({
      ...getState(),
      selectedDrawerTab: name
    })
  })
}
