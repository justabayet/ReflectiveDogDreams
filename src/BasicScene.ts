import * as THREE from 'three'
import { GUI } from 'dat.gui'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

/**
 * A class to set up some basic scene elements to minimize code in the
 * main execution file.
 */
export default class BasicScene extends THREE.Scene {

  // A dat.gui class debugger that is added by default
  debugger: GUI = null

  wall: THREE.Object3D = null

  // Setups a scene camera
  camera: THREE.PerspectiveCamera = null

  // setup renderer
  renderer: THREE.WebGLRenderer = null

  // setup Orbitals
  orbitals: OrbitControls = null

  // Holds the lights for easy reference
  lights: Array<THREE.Light> = []

  // Number of PointLight objects around origin
  lightCount: number = 1

  // Distance above ground place
  lightDistance: number = 4

  // Get some basic params
  width = window.innerWidth
  height = window.innerHeight

  /**
   * Initializes the scene by adding lights, and the geometry
   */
  initialize(debug: boolean = true, addGridHelper: boolean = true) {

    // setup camera
    this.camera = new THREE.PerspectiveCamera(35, this.width / this.height, .1, 1000)
    this.camera.position.z = 12
    this.camera.position.y = 12
    this.camera.position.x = 12

    // setup renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById("app") as HTMLCanvasElement,
      alpha: true,
      antialias: true
    })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(this.width, this.height)
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap

    // add window resizing
    BasicScene.addWindowResizing(this.camera, this.renderer)

    // sets up the camera's orbital controls
    this.orbitals = new OrbitControls(this.camera, this.renderer.domElement)

    // Adds an origin-centered grid for visual reference
    if (addGridHelper) {

      // Adds a grid
      this.add(new THREE.GridHelper(10, 10, 'red'))

      // Adds an axis-helper
      this.add(new THREE.AxesHelper(3))
    }

    // set the background color
    this.background = new THREE.Color(0x000000)

    const ambient = new THREE.AmbientLight(0xFFFFFF, 0.1)
    // this.add(ambient)


    const spotLight = new THREE.SpotLight(0xFFFFFF, 1, undefined, undefined, undefined, 1)
    let lightX = this.lightDistance * Math.sin(Math.PI * 2 / this.lightCount * 1)
    let lightZ = this.lightDistance * Math.cos(Math.PI * 2 / this.lightCount * 1)

    spotLight.castShadow = true

    // Create a light
    spotLight.position.set(0, 0, -2)
    spotLight.lookAt(0, 0, -5)
    spotLight.angle = 0.1
    this.add(spotLight)
    this.add(spotLight.target)
    this.add(new THREE.SpotLightHelper(spotLight, 0xff9900))

    // Creates the geometry + materials
    const geometry = new THREE.BoxGeometry(2, 2, 1)
    const material = new THREE.MeshPhongMaterial({ color: 0xff9900, reflectivity: 1 })
    let cube = new THREE.Mesh(geometry, material)
    cube.position.y = 0.5
    cube.position.z = 7
    cube.castShadow = true
    cube.receiveShadow = false

    // add to scene
    this.add(cube)


    let center = new THREE.Object3D()
    center.position.x = 0
    center.position.y = 0
    center.position.z = 0
    // Creates the geometry + materials
    const geometryWall = new THREE.BoxGeometry(5, 5, 0.1)
    // const materialWall = new THREE.MeshPhongMaterial({ color: 0xff9900, reflectivity: 1, refractionRatio: 1 })

    const materialWall = new THREE.MeshPhysicalMaterial({
      color: 0xff00ff,
      transmission: 1,
      opacity: 0.5,
      metalness: 0,
      roughness: 0,
      ior: 2.3,
      thickness: 0.01,
      specularIntensity: 1,
      envMapIntensity: 1,
      reflectivity: 1,
      sheenColor: new THREE.Color(0x0000FF),
      sheen: 1
    })

    let wall = new THREE.Mesh(geometryWall, materialWall)
    wall.position.x = 0
    wall.position.y = 1
    wall.position.z = 2
    wall.receiveShadow = true

    this.add(center)
    center.add(wall)

    this.wall = center
    this.wall.rotation.y -= 0.4
    const geometryWall2 = new THREE.BoxGeometry(5, 5, 0.1)
    // const materialWall = new THREE.MeshPhongMaterial({ color: 0xff9900, reflectivity: 1, refractionRatio: 1 })
    const materialWall2 = new THREE.MeshPhongMaterial({
      refractionRatio: 0.5,
      opacity: 0.5
    })

    let wall2 = new THREE.Mesh(geometryWall2, materialWall2)
    wall2.position.x = 3
    wall2.position.y = 1
    wall2.position.z = 0
    wall2.receiveShadow = true
    wall2.rotation.y -= 1
    // this.add(wall2)


    // setup Debugger
    if (debug) {
      this.debugger = new GUI()

      const spotLightGroup = this.debugger.addFolder("SpotLight")
      spotLightGroup.add(spotLight.position, 'x', -10, 10)
      spotLightGroup.add(spotLight.position, 'y', .5, 10)
      spotLightGroup.add(spotLight.position, 'z', -10, 10)
      spotLightGroup.add(spotLight, 'angle', -Math.PI/2, Math.PI/2)
      spotLightGroup.open()

      // Add the cube with some properties
      const cubeGroup = this.debugger.addFolder("Cube")
      cubeGroup.add(cube.position, 'x', -10, 10)
      cubeGroup.add(cube.position, 'y', .5, 10)
      cubeGroup.add(cube.position, 'z', -10, 10)
      cubeGroup.open()

      // Add the cube with some properties
      const wallGroup = this.debugger.addFolder("wall")
      wallGroup.add(wall.position, 'x', -10, 10)
      wallGroup.add(wall.position, 'y', .5, 10)
      wallGroup.add(wall.position, 'z', -10, 10)
      wallGroup.add(wall.material, 'ior', 0, 20)
      wallGroup.open()

      // Add camera to debugger
      const cameraGroup = this.debugger.addFolder('Camera')
      cameraGroup.add(this.camera, 'fov', 20, 80)
      cameraGroup.add(this.camera, 'zoom', 0, 1)
      cameraGroup.open()

    }
  }

  /**
   * Given a ThreeJS camera and renderer, resizes the scene if the
   * browser window is resized.
   * @param camera - a ThreeJS PerspectiveCamera object.
   * @param renderer - a subclass of a ThreeJS Renderer object.
   */
  static addWindowResizing(camera: THREE.PerspectiveCamera, renderer: THREE.Renderer) {
    window.addEventListener('resize', onWindowResize, false)
    function onWindowResize() {

      // uses the global window widths and height
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
  }

  public update() {
    // if(this.wall) this.wall.rotation.y -= 0.01
  }
}
