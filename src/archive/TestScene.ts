import * as THREE from 'three'
import { GUI } from 'dat.gui'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import WallTargetable from './WallTargetable'

/**
 * A class to set up some basic scene elements to minimize code in the
 * main execution file.
 */
export default class TestScene extends THREE.Scene {

  // A dat.gui class debugger that is added by default
  debugger: GUI = null

  diamond: THREE.Object3D = null

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

  raycaster: THREE.Raycaster = null

  lastIntersect: THREE.Mesh = null

  spotLight3: THREE.SpotLight = null
  wall: THREE.Mesh = null
  helper: THREE.SpotLightHelper = null

  shadowCube: THREE.Mesh = null
  helperCube: THREE.Mesh = null

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
    TestScene.addWindowResizing(this.camera, this.renderer)

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
    this.add(ambient)


    const spotLight = new THREE.SpotLight(0xFF0000, 1, undefined, undefined, undefined, 1)
    spotLight.castShadow = true
    spotLight.position.set(5, 0, 0)
    spotLight.lookAt(0, 0, 0)
    spotLight.angle = 0.1
    this.add(spotLight)
    this.add(new THREE.SpotLightHelper(spotLight, 0xff9900))

    const direction = new THREE.Vector3(-1, 0, 0)
    // spotLight.getWorldDirection(direction)

    this.raycaster = new THREE.Raycaster(spotLight.position, direction.normalize())
    this.raycaster.layers.set(1)
    const arrowHelper = new THREE.ArrowHelper(direction.normalize(), spotLight.position)
    this.add(arrowHelper)

    this.addWalls()


    const geometryWall = new THREE.BoxGeometry(2, 2, 0.1)
    const materialWall = new THREE.MeshPhongMaterial()

    this.diamond = new THREE.Object3D()
    this.diamond.position.set(0, 0, 0)

    this.add(this.diamond)


    const geometry1 = new THREE.BoxGeometry(0.2, 0.2, 0.1)
    const material1 = new THREE.MeshPhongMaterial({ color: 0xff9900, reflectivity: 1 })

    let wall = new WallTargetable(geometryWall, new THREE.MeshPhongMaterial())

    // let cube1 = new THREE.Mesh(geometry1, material1)
    // cube1.position.set(0, 0, 1)
    // wall.target = cube1
    // wall.add(cube1)

    wall.position.x = 0.69
    wall.position.y = 0
    wall.position.z = -0.69
    wall.receiveShadow = true
    wall.rotation.y += Math.PI - Math.PI/4
    wall.layers.enable(1)
    wall.axis = new THREE.Vector3(1, 0, 0)

    this.diamond.add(wall)


    wall = new WallTargetable(geometryWall, new THREE.MeshPhongMaterial())

    // cube1 = new THREE.Mesh(geometry1, material1)
    // cube1.position.set(0, 0, 1)
    // wall.target = cube1
    // wall.add(cube1)

    wall.position.x = -0.69
    wall.position.y = 0
    wall.position.z = 0.69
    wall.receiveShadow = true
    wall.rotation.y -= Math.PI/4
    wall.axis = new THREE.Vector3(-1, 0, 0)
    wall.layers.enable(1)

    this.diamond.add(wall)



    wall = new WallTargetable(geometryWall, new THREE.MeshPhongMaterial())
    // cube1 = new THREE.Mesh(geometry1, material1)
    // cube1.position.set(0, 0, 1)
    // wall.target = cube1
    // wall.add(cube1)
    wall.position.x = -0.69
    wall.position.y = 0
    wall.position.z = -0.69
    wall.receiveShadow = true
    wall.rotation.y -= Math.PI - Math.PI/4
    wall.axis = new THREE.Vector3(0, 0, -1)

    wall.layers.enable(1)

    this.diamond.add(wall)



    wall = new WallTargetable(geometryWall, new THREE.MeshPhongMaterial())
    // wall.material.color = new THREE.Color(0xAAAAFF)

    // cube1 = new THREE.Mesh(geometry1, material1)
    // cube1.position.set(0, 0, 1)
    // wall.target = cube1
    // wall.add(cube1)

    wall.position.x = 0.69
    wall.position.y = 0
    wall.position.z = 0.69
    wall.receiveShadow = true
    wall.layers.enable(1)
    wall.axis = new THREE.Vector3(0, 0, 1)

    const spotLight2 = new THREE.SpotLight(0x00FF00, 1, undefined, undefined, undefined, 1)
    spotLight2.castShadow = true
    spotLight2.position.set(0, 0, 0.5)
    spotLight2.lookAt(0, 0, -5)
    spotLight2.angle = 0.1

    wall.add(spotLight2)




    this.helperCube = new THREE.Mesh(geometry1, material1)
    this.helperCube.position.set(0, 0, 0)
    // this.helperCube.castShadow = true
    wall.add(this.helperCube)

    // const helperCube2 = new THREE.Mesh(geometry1, material1)
    // helperCube2.position.set(0, 0, 1)
    // this.helperCube.add(helperCube2)



    this.spotLight3 = new THREE.SpotLight(0x0000FF, 10, undefined, undefined, 0.5, 1)
    this.spotLight3.castShadow = true

    this.spotLight3.position.set(0, 0, 0)
    // this.spotLight3.lookAt(0, 0, -1)
    // this.spotLight3.target = helperCube2
    this.spotLight3.angle = 0.1



    const geometryGhost = new THREE.BoxGeometry(0.2, 0.2, 0.2)
    const materialGhost = new THREE.MeshPhongMaterial({ color: 0xFFFF00, reflectivity: 1, transparent: true, opacity: 0.000001 })
    this.shadowCube = new THREE.Mesh(geometryGhost, materialGhost)
    this.shadowCube.castShadow = true
    this.shadowCube.scale.x = 0.3
    this.shadowCube.scale.y = 0.3
    this.shadowCube.scale.z = 0.3
    console.log(this.shadowCube)
    wall.add(this.shadowCube)

    wall.add(this.spotLight3)
    // wall.add(this.spotLight3.target)
    // wall.rotation.y -= 1
    wall.rotation.y += Math.PI/4
    this.diamond.add(wall)
    this.diamond.rotateX(10)
    this.diamond.rotateY(10)
    this.diamond.rotateZ(10)
    this.wall = wall

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

    if (debug) {
      this.debugger = new GUI()

      // Add the cube with some properties
      const diamondGroup = this.debugger.addFolder("diamond")
      diamondGroup.add(this.diamond.position, 'x', -10, 10)
      diamondGroup.add(this.diamond.position, 'y', .5, 10)
      diamondGroup.add(this.diamond.position, 'z', -10, 10)
      diamondGroup.add(this.diamond.rotation, 'y', 0, 2*Math.PI)

      diamondGroup.open()
    }
  }

  addWalls() {
    // Create walls
    const geometryWall = new THREE.BoxGeometry(7, 7, 0.1)
    const materialWall = new THREE.MeshPhongMaterial()

    let wall = new THREE.Mesh(geometryWall, materialWall)
    wall.position.x = 5
    wall.position.y = 0
    wall.position.z = 0
    wall.receiveShadow = true
    wall.rotation.y -= Math.PI/2
    this.add(wall)

    wall = new THREE.Mesh(geometryWall, materialWall)
    wall.position.x = -5
    wall.position.y = 0
    wall.position.z = 0
    wall.receiveShadow = true
    wall.rotation.y -= Math.PI/2
    this.add(wall)

    wall = new THREE.Mesh(geometryWall, materialWall)
    wall.position.x = 0
    wall.position.z = 5
    wall.position.y = 0
    wall.receiveShadow = true
    wall.rotation.y -= 0
    this.add(wall)

    wall = new THREE.Mesh(geometryWall, materialWall)
    wall.position.x = 0
    wall.position.z = -5
    wall.position.y = 0
    wall.receiveShadow = true
    wall.rotation.y -= 0
    this.add(wall)
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
    if(this.diamond) this.diamond.rotation.y -= 0.001


    if (this.raycaster) {
      const intersects = this.raycaster.intersectObjects<WallTargetable>( this.diamond.children );
      if(this.lastIntersect) (this.lastIntersect.material as THREE.MeshPhongMaterial).color.set( 0x000000 );

      const intersected = intersects[0];

      if(intersected) {
        ((intersected.object as THREE.Mesh).material as THREE.MeshPhongMaterial).color.set( 0xff0000 );
        this.lastIntersect = (intersected.object as THREE.Mesh)
        // console.log(intersected.point)
        const localePos = this.wall.worldToLocal(intersected.point)
        // const localeNormal = this.wall.worldToLocal(intersected.normal)
        // console.log(intersected, localeNormal)
        this.spotLight3.position.set(localePos.x, localePos.y, localePos.z)
        this.helperCube.position.set(localePos.x, localePos.y, localePos.z)
        this.shadowCube.position.set(localePos.x, localePos.y, localePos.z)

        if((this.lastIntersect as WallTargetable).axis) {
          let axis = (this.lastIntersect as WallTargetable).axis
          this.helperCube.position.add(axis)
          this.shadowCube.position.add(axis.clone().multiplyScalar(2))
        }

        this.spotLight3.target = this.helperCube

        // if((this.lastIntersect as WallTargetable).target) this.spotLight3.target = (this.lastIntersect as WallTargetable).target
        // this.helper.update()

      } else {
        this.lastIntersect = null
      }

      // for ( let i = 0; i < 1; i++ ) {

      //   ((intersects[ i ].object as THREE.Mesh).material as THREE.MeshPhongMaterial).color.set( 0xff0000 );

      // }
    }
  }
}
