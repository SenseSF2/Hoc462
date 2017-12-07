import EventBus from '../EventBus'
import SlideDrawer from './SlideDrawer'
import RoomDrawer from './RoomDrawer'
import selectDrawerTab from '../actions/selectDrawerTab'
import styles from './Drawer.css'
export default () => {
  const root = document.createElement('div')
  root.classList.add(styles.drawer)
  root.innerHTML = `
    <div class="tabs">
      <button class="tab slide">Slide</button>
      <button class="tab world">Room</button>
    </div>
    <div class="content"></div>
  `
  const tabsElement = root.querySelector('.tabs')
  const slideButton = root.querySelector('.slide')
  const worldButton = root.querySelector('.world')
  const drawerContent = root.querySelector('.content')
  const slideDrawer = SlideDrawer()
  const roomDrawer = RoomDrawer()
  slideButton.addEventListener('click', () => {
    EventBus.dispatchEvent(selectDrawerTab('slide'))
  })
  worldButton.addEventListener('click', () => {
    EventBus.dispatchEvent(selectDrawerTab('world'))
  })
  EventBus.addEventListener('drawer-tab-selected', ({ detail: { name } }) => {
    slideButton.removeAttribute('disabled')
    worldButton.removeAttribute('disabled')
    drawerContent.innerHTML = ''
    switch (name) {
      case 'slide':
        slideButton.setAttribute('disabled', '')
        drawerContent.appendChild(slideDrawer)
        break
      case 'world':
        worldButton.setAttribute('disabled', '')
        drawerContent.appendChild(roomDrawer)
        break
    }
  })
  EventBus.dispatchEvent(selectDrawerTab('world'))
  EventBus.addEventListener('current-drawer-tab-locked', () => {
    root.classList.add('locked')
  })
  EventBus.addEventListener('current-drawer-tab-unlocked', () => {
    root.classList.remove('locked')
  })
  EventBus.addEventListener('drawer-hidden', () => {
    tabsElement.style.display = 'none'
    drawerContent.style.display = 'none'
  })
  EventBus.addEventListener('drawer-shown', () => {
    tabsElement.style.display = ''
    drawerContent.style.display = ''
  })
  return root
}
