import React from "react";
import { observer } from "mobx-react";
// eslint-disable-next-line
import "script-loader!three/build/three.js";
import "three/examples/js/controls/OrbitControls";
import "three/examples/js/controls/TransformControls";
import "../../vendor/ThreeCSG";
import styles from "./index.css";
import Controls from "./Controls";
import Object3D from "./Object3D";
import ObjectGroup from "./ObjectGroup";
import onObject3DClick from "./onObject3DClick";
import resizeRendererFunctionMaker from "./resizeRenderer";
import {
  SLIDE,
  CHOOSE_ANIMATION_TARGET,
  ADD_ANIMATION,
  GROUP
} from "../../constants";
/* global THREE */
@observer
export default class Renderer extends React.Component {
  itsTimeToStop = false;
  constructor(props) {
    super(props);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    this.domElement = renderer.domElement;
    const scene = (this.scene = new THREE.Scene());
    const camera = (this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    ));
    const pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(1, 1, 2);
    camera.add(pointLight);
    const gridHelper = new THREE.GridHelper(40, 80);
    scene.add(gridHelper);
    camera.position.z = 5;
    camera.lookAt(gridHelper.position);
    scene.add(camera);
    this.onObject3DClick = onObject3DClick(camera, renderer.domElement);
    const resizeRenderer = resizeRendererFunctionMaker();
    const animate = () => {
      if (this.itsTimeToStop) return;
      resizeRenderer({ root: this.root, camera, renderer });
      if (this.transformControls !== undefined) {
        this.transformControls.update();
      }
      renderer.render(scene, camera);
      window.requestAnimationFrame(animate);
    };
    window.requestAnimationFrame(animate);
  }
  componentDidMount() {
    this.root.appendChild(this.domElement);
  }
  componentWillUnmount() {
    this.itsTimeToStop = true;
  }
  selectObject(object) {
    const { uiState, objects, objectGroup } = this.props;
    if (uiState.objectSelectionEnabled) {
      if (uiState.isGroupingObjects) {
        if (objectGroup.items.includes(object)) objectGroup.remove(object);
        else objectGroup.add(object);
      } else objects.select(object);
    }
  }
  render() {
    const { objects, selectedSlide, uiState, objectGroup } = this.props;
    const { transformControlsMode } = uiState;
    const currentView =
      uiState.selectedDrawerTab === SLIDE && selectedSlide !== undefined
        ? selectedSlide
        : uiState;
    const currentObject = uiState.isSettingAnimation
      ? uiState.clonedAnimationTarget
      : objects.selected;
    return (
      <React.Fragment>
        <div
          className={styles.renderer}
          ref={element => {
            this.root = element;
          }}
        />
        <Controls
          camera={this.camera}
          domElement={this.domElement}
          orbitControlsEnabled={uiState.orbitControlsEnabled}
          transformControlsEnabled={uiState.transformControlsEnabled}
          view={currentView}
          object={currentObject}
          instance={({
            transformControls,
            transformControlsAttachedObject
          }) => {
            this.scene.add(transformControls, transformControlsAttachedObject);
            this.transformControls = transformControls;
          }}
          transformControlsMode={transformControlsMode}
        />
        {uiState.currentObjectStates.map(clone => {
          let clickHandler, object;
          const originalObject = objects.items.find(
            ({ id }) => id === clone.originalId
          );
          if (
            uiState.isSettingAnimation &&
            objects.selected.id === clone.originalId &&
            uiState.addAnimationStep > CHOOSE_ANIMATION_TARGET
          )
            object = uiState.clonedAnimationTarget;
          else if (
            uiState.selectedDrawerTab === SLIDE ||
            uiState.selectedDrawerTab === ADD_ANIMATION
          )
            object = clone.clone;
          else object = originalObject;
          const createObjectElement = (
            object,
            originalObject,
            add,
            update,
            remove
          ) => (
            <Object3D
              key={originalObject.id}
              textureType={object.texture.type}
              textureValue={object.texture.value}
              type={object.type}
              isHole={object.isHole}
              positionX={object.position[0]}
              positionY={object.position[1]}
              positionZ={object.position[2]}
              rotationX={object.rotation[0]}
              rotationY={object.rotation[1]}
              rotationZ={object.rotation[2]}
              scaleX={object.scale[0]}
              scaleY={object.scale[1]}
              scaleZ={object.scale[2]}
              instance={(instance, boundingBox) => {
                if (add !== undefined) {
                  add(instance);
                  return;
                }
                this.scene.add(instance, boundingBox);
                this.onObject3DClick.onClick(
                  instance,
                  (clickHandler = () => this.selectObject(originalObject))
                );
              }}
              update={update === undefined ? () => {} : update}
              remove={(instance, boundingBox) => {
                if (remove !== undefined) {
                  remove(instance);
                  return;
                }
                this.scene.remove(boundingBox);
                this.onObject3DClick.removeClickHandler(instance, clickHandler);
                this.scene.remove(instance, boundingBox);
              }}
              selected={
                uiState.isGroupingObjects
                  ? objectGroup.items.includes(originalObject)
                  : objects.selected === originalObject
              }
            />
          );
          if (object.type === GROUP) {
            return (
              <ObjectGroup
                onObject3DClick={this.onObject3DClick}
                instance={(group, boundingBox) =>
                  this.scene.add(group, boundingBox)
                }
                remove={(group, boundingBox) =>
                  this.scene.remove(group, boundingBox)
                }
                select={() => this.selectObject(object)}
                object={object}
                selected={originalObject === objects.selected}
              >
                {({ select, add, update, remove }) =>
                  object.children.items.map(item =>
                    createObjectElement(
                      item,
                      item,
                      object3D => add(object3D, item.isHole),
                      object3D => update(object3D, item.isHole),
                      remove
                    )
                  )
                }
              </ObjectGroup>
            );
          }
          return createObjectElement(object, originalObject);
        })}
      </React.Fragment>
    );
  }
}
