import React from 'react'
import { observer } from 'mobx-react'
import styles from './Slides.css'
import { button } from './Button.css'
import Slide from './Slide'
import { LEFT, RIGHT } from '../constants'
export default observer(({ slides, create, crafty = window.slides = slides }) =>
  <div className={styles.slides}>
    <span>Slides</span>{' '}
    <button className={`${button} create`} onClick={create}>Create new</button>
    <ul className='list'>
      {slides.items.map(item =>
        <Slide
          slide={item} selected={slides.selected === item}
          select={() => slides.select(item)} remove={() => slides.remove(item)}
          moveUp={() => slides.move(item, LEFT)}
          moveDown={() => slides.move(item, RIGHT)}
        />
      )}
    </ul>
  </div>
)
