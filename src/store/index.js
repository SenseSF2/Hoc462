import slides from './slides'
import objects from './objects'
import selectedObject from './selectedObject'
import selectedDrawerTab from './selectedDrawerTab'
import transformControlsMode from './transformControlsMode'
import isSlideViewChanging from './isSlideViewChanging'
import isAddingAnimation from './isAddingAnimation'
let store = {
  slides: [],
  selectedSlide: null,
  objects: [],
  selectedObject: null,
  selectedDrawerTab: null,
  transformControlsMode: 'translate',
  isSlideViewChanging: false
}
const getState = () => store
const setState = x => {
  console.log('STORE CHANGED')
  console.log('Prev:', store)
  console.log('Next:', x)
  store = x
}
slides({ getState, setState })
objects({ getState, setState })
selectedObject({ getState, setState })
selectedDrawerTab({ getState, setState })
transformControlsMode({ getState, setState })
isSlideViewChanging({ getState, setState })
isAddingAnimation({ getState, setState })
export default getState
