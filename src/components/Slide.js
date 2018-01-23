import React from 'react'
import { observer } from 'mobx-react'
import Renamable from './Renamable'
import { button } from './Button.css'
@observer
export default class Slide extends React.Component {
  state = {
    isRenaming: false
  }
  startRenaming () {
    this.setState({ isRenaming: true })
  }
  handleRename (name) {
    const { slide } = this.props
    slide.rename(name)
    this.setState({ isRenaming: false })
  }
  render () {
    const { slide, remove, select, selected, moveUp, moveDown } = this.props
    const { isRenaming } = this.state
    return (
      <li className={selected ? 'selected': ''} onClick={select}>
        <Renamable
          value={slide.name}
          onSubmit={name => this.handleRename(name)}
          isRenaming={isRenaming}
        />
        <span className='actions'>
          <button className={button} onClick={remove}>Delete</button>{' '}
          <button className={button} onClick={() => this.startRenaming()}>
            Rename
          </button>{' '}
          {selected
          ? <span>
            Move:{' '}
            <button className={button} onClick={moveUp}>Up</button>{' '}
            <button className={button} onClick={moveDown}>Down</button>
          </span> : undefined}
        </span>
      </li>
    )
  }
}
