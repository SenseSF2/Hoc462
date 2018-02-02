import React from 'react'
import { observer } from 'mobx-react'
import { SLIDE, ROOM, CAPTION } from '../constants'
import store from '../store'
import Slide from '../store/Slide'
import Object3D from '../store/Object3D'
import Header from './Header'
import Slides from './Slides'
import Drawer from './Drawer'
import RoomDrawer from './RoomDrawer'
import Renderer from './Renderer'
const App = observer(() =>
  <div>
    <Header />
    <Slides
      slides={store.slides} create={() => store.slides.add(new Slide())}
    />
    <Renderer
      objects={store.objects}
      transformControlsMode={store.transformControlsModes.selected}
    />
    <Drawer
      selectedTab={store.drawerTabs.selected}
      select={tab => store.drawerTabs.select(tab)}
    >{[
      {
        id: SLIDE, name: 'Slide',
        component: () => <div>Not implemented</div>
      },
      {
        id: ROOM, name: 'Room',
        component: () => <RoomDrawer
          objects={store.objects}
          add={type => store.objects.add(new Object3D(type))}
          changeTransformControlsMode={
            mode => store.transformControlsModes.select(mode)
          }
        />
      },
      {
        id: CAPTION, name: 'Caption',
        component: () => <div>Not implemented</div>
      }
    ]}</Drawer>
  </div>
)
App.displayName = 'App'
export default App
