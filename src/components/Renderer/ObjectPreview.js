import React from "react";
import { observer } from "mobx-react";
import Object3D from "./Object3D";
import resizeRendererFunctionMaker from "./resizeRenderer";
/* global THREE */
@observer
export default class ObjectPreview extends React.Component {
  itsTimeToStop = false;
  constructor(props) {
    super(props);
    const renderer = (this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    }));
    this.domElement = renderer.domElement;
    this.scene = new THREE.Scene();
    const camera = (this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    ));
    const pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(1, 1, 2);
    camera.add(pointLight);
    this.scene.add(camera);
    camera.position.z = 5;
    const resizeRenderer = resizeRendererFunctionMaker();
    const animate = () => {
      resizeRenderer({
        root: this.root,
        camera,
        renderer,
        onResize: () => {
          renderer.render(this.scene, this.camera);
        }
      });
      window.requestAnimationFrame(animate);
    };
    window.requestAnimationFrame(animate);
    renderer.render(this.scene, this.camera);
  }
  componentDidMount() {
    this.root.appendChild(this.renderer.domElement);
  }
  componentWillUnmount() {
    this.itsTimeToStop = true;
  }
  render() {
    const { object, width, height } = this.props;
    return (
      <React.Fragment>
        <div
          ref={element => {
            this.root = element;
          }}
          style={{ width: width + "px", height: height + "px" }}
        />
        <Object3D
          key={object.id}
          textureType={object.texture.type}
          textureValue={object.texture.value}
          type={object.type}
          isHole={object.isHole}
          positionX={0}
          positionY={0}
          positionZ={0}
          rotationX={object.rotation[0]}
          rotationY={object.rotation[1]}
          rotationZ={object.rotation[2]}
          scaleX={object.scale[0]}
          scaleY={object.scale[1]}
          scaleZ={object.scale[2]}
          instance={instance => {
            this.scene.add(instance);
          }}
          remove={instance => {
            this.scene.remove(instance);
          }}
          update={() => this.renderer.render(this.scene, this.camera)}
        />
      </React.Fragment>
    );
  }
}
