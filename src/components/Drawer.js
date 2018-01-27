import React from 'react'
import { SLIDE, ROOM, CAPTION } from '../constants'
import styles from './Drawer.css'
const Drawer = ({ selectedTab, select, store, children: tabs }) =>
  <div className={styles.drawer}>
    <div className='tabs'>
      {tabs.map(({ name, id }) =>
        <button
          className='tab' disabled={selectedTab === id}
          onClick={() => select(id)} key={id.toString()}
        >{name}</button>
      )}
    </div>
    <div className='content'>
      {tabs.find(({ id }) => id === selectedTab).component()}
    </div>
  </div>
export default Drawer
