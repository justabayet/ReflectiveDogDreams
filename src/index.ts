import BasicScene from "./BasicScene"
import TestScene from "./TestScene"

// sets up the scene
// let scene = new BasicScene()
let scene = new TestScene()
scene.initialize()

// loops updates
function loop() {
  scene.update()
  scene.camera.updateProjectionMatrix()
  scene.renderer.render(scene, scene.camera)
  scene.orbitals.update()
  requestAnimationFrame(loop)
}

// runs a continuous loop
loop()
