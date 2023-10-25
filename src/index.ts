import CustomScene from "./CustomScene"
import Stats from 'three/examples/jsm/libs/stats.module'

export const scene = new CustomScene()

const debug = false

const stats = new Stats()
if (debug) {
  stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild(stats.dom)
}

let startTime = 0

/**
 * @param time in millis
 */
function loop(time: number) {
  const delta = time - startTime
  startTime = time

  if(debug) stats.update()
  scene.update(delta)
  scene.camera.updateProjectionMatrix()
  scene.renderer.render(scene, scene.camera)
  // scene.orbitals.update()
  requestAnimationFrame(loop)
}

requestAnimationFrame(loop)
