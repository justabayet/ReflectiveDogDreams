import CustomScene from "./CustomScene"

// sets up the scene
// let scene = new BasicScene()
export const scene = new CustomScene()

function loop() {
  scene.update()
  scene.camera.updateProjectionMatrix()
  scene.renderer.render(scene, scene.camera)
  scene.orbitals.update()
  requestAnimationFrame(loop)
}

loop()
