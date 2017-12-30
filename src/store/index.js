import slides from './slides'
import objects from './objects'
import resetState from './resetState'
import selectedObject from './selectedObject'
import selectedDrawerTab from './selectedDrawerTab'
import transformControlsMode from './transformControlsMode'
import isSlideViewChanging from './isSlideViewChanging'
import isAddingAnimation from './isAddingAnimation'
import objectGroup from './objectGroup'
import isGroupingObjects from './isGroupingObjects'
import id from './id'
let store = {
  slides: [],
  selectedSlide: null,
  objects: [],
  selectedObject: null,
  selectedDrawerTab: null,
  transformControlsMode: 'translate',
  isSlideViewChanging: false,
  objectGroup: [],
  isGroupingObjects: false,
  id: 0
}
const getState = () => store
const setState = x => {
  console.log('STORE CHANGED')
  console.log('Prev:', store)
  console.log('Next:', x)
  store = x
}
resetState({ getState, setState })
slides({ getState, setState })
objects({ getState, setState })
selectedObject({ getState, setState })
selectedDrawerTab({ getState, setState })
transformControlsMode({ getState, setState })
isSlideViewChanging({ getState, setState })
isAddingAnimation({ getState, setState })
objectGroup({ getState, setState })
isGroupingObjects({ getState, setState })
id({ getState, setState })
export default getState
