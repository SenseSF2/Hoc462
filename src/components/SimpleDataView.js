import React from 'react'
import { observer } from 'mobx-react'
import store from '../store'
import Animation from '../store/Animation'
import Object3D from '../store/Object3D'
import Slide from '../store/Slide'
export default observer(() =>
  <div>
    <h1>Objects</h1>
    <ul>
      {store.objects.items
        .map(item =>
          <li onClick={() => store.objects.select(item)}>{item.name}</li>)}
    </ul>
    <h1>Selected object</h1>
    {store.objects.selected &&
      <ul>
        <li>Name: {store.objects.selected.name}</li>
        <li>Type: {store.objects.selected.type.toString()}</li>
        <li>
          Texture:
          <ul>
            <li>Type: {store.objects.selected.texture.type.toString()}</li>
            <li>Color: {store.objects.selected.texture.color}</li>
            <li>Image URL: {store.objects.selected.texture.imageUrl}</li>
          </ul>
        </li>
        <li>Position: {JSON.stringify(store.objects.selected.position)}</li>
        <li>Rotation: {JSON.stringify(store.objects.selected.rotation)}</li>
        <li>Scale: {JSON.stringify(store.objects.selected.scale)}</li>
      </ul>}
    <h1>Slides</h1>
    <ul>
      {store.slides.items
        .map(item =>
          <li onClick={() => store.slides.select(item)}>{item.name}</li>)}
    </ul>
    <h1>Selected slide</h1>
    {store.slides.selected &&
      <ul>
        <li>Name: {store.slides.selected.name}</li>
        <li>
          View:
          <ul>
            <li>
              Position: {JSON.stringify(store.slides.selected.viewPosition)}
            </li>
            <li>
              Rotation: {JSON.stringify(store.slides.selected.viewRotation)}
            </li>
          </ul>
        </li>
        <li>Caption: {store.slides.selected.caption}</li>
        <li>
          Animations:
          <ul>
            {store.slides.selected.animations.items
              .map(item =>
                <li>
                  <ul>
                    <li>Target: {item.target.name}</li>
                    <li>Type: {item.type.toString()}</li>
                    <li>Play when: {item.playWhen.toString()}</li>
                    <li>Duration: {item.duration}</li>
                  </ul>
                </li>)}
          </ul>
        </li>
      </ul>}
  </div>
)
window.store = store
window.Animation = Animation
window.Object3D = Object3D
window.Slide = Slide
