import React from 'react'
import { observer } from 'mobx-react'
import styles from './Slides.css'
import { button } from './Button.css'
import Slide from './Slide'
import { TO_PREVIOUS_INDEX, TO_NEXT_INDEX } from '../constants'
const Slides = observer(({ slides, create }) =>
  <div className={styles.slides}>
    <span>Slides</span>
    <button className={`${button} create`} onClick={create}>Create new</button>
    <ul className='list'>
      {slides.items.map(item =>
        <Slide
          key={item.id}
          slide={item} selected={slides.selected === item}
          select={() => slides.select(item)} remove={() => slides.remove(item)}
          moveUp={() => slides.move(item, TO_PREVIOUS_INDEX)}
          moveDown={() => slides.move(item, TO_NEXT_INDEX)}
        />
      )}
    </ul>
  </div>
)
Slides.displayName = 'Slides'
export default Slides
