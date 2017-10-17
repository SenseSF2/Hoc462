import './reset.css'
import './base.css'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Drawer from './components/Drawer'
import Renderer from './components/Renderer'
require('./store')
const root = document.getElementById('root')
root.appendChild(Header())
root.appendChild(Sidebar())
root.appendChild(Drawer())
root.appendChild(Renderer())
