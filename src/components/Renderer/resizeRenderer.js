export default () => {
  let oldWidth = 0;
  let oldHeight = 0;
  return ({ root, camera, renderer, onResize = () => {} }) => {
    const newWidth = root.clientWidth;
    const newHeight = root.clientHeight;
    if (newWidth !== oldWidth || newHeight !== oldHeight) {
      [oldWidth, oldHeight] = [newWidth, newHeight];
      camera.aspect = root.clientWidth / root.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(root.clientWidth, root.clientHeight, false);
      onResize();
    }
  };
};
