import { AmbientLight, AxesHelper, Color, GridHelper, PCFSoftShadowMap, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import Room from "./Room";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const addGridHelper = true;

export default class CustomScene extends Scene {
  private rooms: Room[] = []
  public camera: PerspectiveCamera
  public renderer: WebGLRenderer
  public orbitals: OrbitControls

  width = window.innerWidth
  height = window.innerHeight

  constructor() {
    super()

    const cameraPos = 12

    this.camera = new PerspectiveCamera(35, this.width / this.height, .1, 1000)
    this.camera.position.set(cameraPos, cameraPos, cameraPos)

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

    // sets up the camera's orbital controls
    this.orbitals = new OrbitControls(this.camera, this.renderer.domElement)

    if (addGridHelper) {
      this.add(new GridHelper(10, 10, 'red'))
      this.add(new AxesHelper(3))
    }

    this.background = new Color(0x000000)

    const ambient = new AmbientLight(0xFFFFFF, 0.1)
    this.add(ambient)

    const room = new Room()
    this.rooms.push(room)
    this.add(room)
  }

  public update() {
    this.rooms.forEach(room => room.update())
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
