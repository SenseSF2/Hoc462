import React from 'react'
import { observer } from 'mobx-react'
import { TRANSLATE, ROTATE, SCALE, LINEAR, QUAD, AFTER_PREVIOUS, WITH_PREVIOUS } from '../constants'
import { button } from './Button.css'
export default observer(({ animation }) =>
  <div>
    <h1>
      <span style={{ fontWeight: 'bold' }}>{animation.target.name}</span> [{({
        [TRANSLATE]: 'Translate', [ROTATE]: 'Rotate', [SCALE]: 'Scale'
      })[animation.type]}]
    </h1>
    <h2>
      Duration:
      <input
        type="number" value={animation.duration / 1000}
        onChange={({ target: { value } }) => animation.setDuration(value * 1000)}
      />
    </h2>
    <h2>
      Animation effect:
      <select
        className={button}
        value={({ [LINEAR]: 'linear', [QUAD]: 'quad' })[animation.easingFunction]}
        onChange={event => animation.setEasingFunction(({
          linear: LINEAR, quad: QUAD
        })[event.target.value])}
      >
        <option value="linear">Linear</option>
        <option value="quad">Quad</option>
      </select>
    </h2>
    <h2>
      Play:
      <select
        className={button}
        value={({
          [AFTER_PREVIOUS]: 'after previous', [WITH_PREVIOUS]: 'with previous'
        })[animation.startTime]}
        onChange={event => animation.setStartTime(({
          'after previous': AFTER_PREVIOUS, 'with previous': WITH_PREVIOUS
        })[event.target.value])}
      >
        <option value="after previous">After previous</option>
        <option value="with previous">With previous</option>
      </select>
    </h2>
    <h2>
      Delay:
      <input
        type="number" value={animation.delay / 1000}
        onChange={event => animation.setDelay(event.target.value * 1000)}
      />
    </h2>
  </div>
)
