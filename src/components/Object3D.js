import React from 'react'
import { observer } from 'mobx-react'
import Renamable from './Renamable'
import { button } from './Button.css'
import styles from './Object3D.css'
@observer
export default class Object3D extends React.Component {
  state = {
    isRenaming: false
  }
  startRenaming () {
    this.setState({ isRenaming: true })
  }
  handleRename (name) {
    const { object } = this.props
    object.rename(name)
    this.setState({ isRenaming: false })
  }
  handleColorChange (event) {
    const { object } = this.props
    object.texture.setColor(event.target.value)
  }
  render () {
    const { isRenaming } = this.state
    const { object, remove, selected, select } = this.props
    return (
      <div
        className={[
          styles.object, selected ? 'highlighted' : undefined
        ].join(' ')}
        onClick={select}
      >
        <div className='name'>
          <Renamable
            value={object.name}
            onSubmit={name => this.handleRename(name)} isRenaming={isRenaming}
          />
        </div>
        <div>
          <button className={button} onClick={remove}>Delete</button>{' '}
          <button className={button}>Clone</button>{' '}
          <button className={button} onClick={() => this.startRenaming()}>
            Rename
          </button>{' '}
          <button className={button}>Set texture</button>{' '}
          <input type='file' className='texture-upload-input' />
          <input
            type='color' value={object.texture.color}
            onChange={event => this.handleColorChange(event)}
          />
        </div>
        <div className='properties'>
          {['Position', 'Rotation', 'Scale'].map(property =>
            <div>
              <label>{property}: </label>
              {object[property.toLowerCase()].map((value, index) =>
                <input
                  type='number' step='0.01' value={value} onChange={event => {
                    const newArray = [...object[property.toLowerCase()]]
                    newArray[index] = +event.target.value
                    object['set' + property](newArray)
                  }}
                />
              )}
            </div>
          )}
        </div>
      </div>
    )
  }
}
