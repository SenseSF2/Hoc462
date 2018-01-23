import React from 'react'
import { observer } from 'mobx-react'
import store from '../store'
import Slide from '../store/Slide'
import Slides from './Slides'
export default observer(() =>
  <div>
    <Slides
      slides={store.slides} create={() => store.slides.add(new Slide())}
    />
  </div>
)
