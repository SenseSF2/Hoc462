/* global THREE */
const mousePosition = (element, rawEvent) => {
  let event;
  if (rawEvent.touches !== undefined) {
    event = rawEvent.touches[0];
  } else {
    event = rawEvent;
  }
  const rect = element.getBoundingClientRect();
  const normal = {
    x: (event.clientX - rect.left) / rect.width * element.width,
    y: (event.clientY - rect.top) / rect.height * element.height
  };
  const webgl = {
    x: normal.x / rect.width * 2 - 1,
    y: -(normal.y / rect.height) * 2 + 1
  };
  return { normal, webgl };
};
export default (camera, domElement) => {
  const handlers = new Map();
  const onClick = event => {
    const { webgl: { x, y } } = mousePosition(domElement, event);
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(x, y);
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(
      [...handlers].map(([object, callbacks]) => object)
    );
    if (intersects.length > 0) {
      const object = intersects[0].object;
      handlers.get(object).forEach(handler => handler(object));
    }
  };
  domElement.addEventListener("click", onClick);
  domElement.addEventListener("touchstart", onClick);
  return {
    onClick: (object3D, callback) => {
      if (handlers.get(object3D) === undefined) {
        handlers.set(object3D, []);
      }
      const callbacks = handlers.get(object3D);
      callbacks.push(callback);
    },
    removeClickHandler: (object3D, callback) => {
      const callbacks = handlers.get(object3D);
      if (callbacks === undefined) return;
      if (callbacks.includes(callback)) {
        callbacks.splice(callbacks.indexOf(callback), 1);
      }
      if (callbacks.length === 0) {
        handlers.clear(object3D);
      }
    }
  };
};
