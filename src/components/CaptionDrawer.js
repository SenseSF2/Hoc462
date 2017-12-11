import EventBus from '../EventBus'
import getState from '../store'
export default () => {
  const root = document.createElement('pre')
  EventBus.addEventListener('caption-shown', ({ detail: { id } }) => {
    const slide = getState().slides.find(
      ({ id: currentId }) => currentId === id
    )
    root.textContent = slide.caption
  })
  return root
}
