import 'babel-polyfill'
import './reset.css'
import './base.css'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import * as mobx from 'mobx'
mobx.useStrict(true)
document.title = 'Hoc462 Room Planner'
const root = document.getElementById('root')
ReactDOM.render(<App />, root)
