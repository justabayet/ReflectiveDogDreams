import { AmbientLight, AxesHelper, Color, GridHelper, Object3D, PCFSoftShadowMap, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from "three"
import Room from "./Room"
import { ControlManager, PLUGIN_KEYS, FirstPersonPlugin, GyroscopePlugin, type Orientation } from 'immersive-controls'


function setupControlManager (camera: PerspectiveCamera, canvas: HTMLCanvasElement): ControlManager {
  const controlManager = new ControlManager()

  const firstPersonPlugin = new FirstPersonPlugin(camera, canvas)

  const onGyroAvailable = (): void => {
    controlManager.addPlugin(gyroscopePlugin)
    controlManager.enableControl(PLUGIN_KEYS.gyroscopeControls)

    setTimeout(() => {
      controlManager.updateOffset()
    }, 1000)
  }

  const gyroscopePlugin = new GyroscopePlugin(camera, onGyroAvailable)

  controlManager.addPlugin(firstPersonPlugin)
  gyroscopePlugin.inertiaFactor = 0.7
  firstPersonPlugin.inertiaFactor = 0.3
  firstPersonPlugin.rotateSpeed = 0.4

  return controlManager
}

const addGridHelper = false;

export default class CustomScene extends Scene {
  private rooms: Room[] = []
  public camera: PerspectiveCamera
  public renderer: WebGLRenderer
  // public orbitals: OrbitControls

  private controlManager: ControlManager

  width = window.innerWidth
  height = window.innerHeight

  constructor() {
    super()

    const cameraPos = 2.5

    this.camera = new PerspectiveCamera(70, this.width / this.height, .1, 1000)
    this.camera.position.set(1, 1, cameraPos)

    this.renderer = new WebGLRenderer({
      canvas: document.getElementById("app") as HTMLCanvasElement,
      alpha: true,
      antialias: true
    })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(this.width, this.height)
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = PCFSoftShadowMap

    // add window resizing
    CustomScene.addWindowResizing(this.camera, this.renderer)

    const target = new Object3D()
    target.position.set(cameraPos, cameraPos, cameraPos)
    // sets up the camera's orbital controls

    this.controlManager = setupControlManager(this.camera, this.renderer.domElement)

    if (addGridHelper) {
      this.add(new GridHelper(10, 10, 'red'))
      this.add(new AxesHelper(3))
    }

    this.background = new Color(0x000000)

    const room = new Room()
    this.rooms.push(room)
    this.add(room)
  }

  public update(delta: number) {
    // this.orbitals.update()
    this.controlManager.update()
    this.rooms.forEach(room => room.update(delta))
  }

  static addWindowResizing(camera: THREE.PerspectiveCamera, renderer: THREE.Renderer) {
    window.addEventListener('resize', onWindowResize, false)
    function onWindowResize() {

      // uses the global window widths and height
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
  }
}
