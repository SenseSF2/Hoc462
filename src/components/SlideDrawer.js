import React from 'react'
import { observer } from 'mobx-react'
import { button } from './Button.css'
export default observer(({ slide, uiState }) =>
  <div>
    {uiState.isSettingView
      ? <button
          className={button} onClick={() => uiState.finishSettingView()}
        >
          I am done
        </button>
      : <button
          className={button} onClick={() => uiState.startSettingView()}
        >
          Set view
        </button>}
  </div>
)
