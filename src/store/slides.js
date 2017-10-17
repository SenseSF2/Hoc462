import EventBus from '../EventBus'
export default ({ getState, setState }) => {
  EventBus.addEventListener('slide-added', ({ detail }) => {
    setState({
      ...getState(),
      slides: [...getState().slides, {
        name: detail.name,
        id: detail.id,
        caption: '',
        animations: []
      }]
    })
  })
  EventBus.addEventListener('slide-selected', ({ detail: { id } }) => {
    setState({ ...getState(), selectedSlide: id })
  })
  EventBus.addEventListener('slide-renamed', ({ detail: { name, id } }) => {
    setState({
      ...getState(),
      slides: getState().slides.map(
        slide => slide.id === id ? { ...slide, name } : slide
      )
    })
  })
  EventBus.addEventListener('slide-removed', ({ detail }) => {
    setState({
      ...getState(),
      slides: getState().slides.filter(({ id }) => id !== detail.id)
    })
  })
}
