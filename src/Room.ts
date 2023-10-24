import { BoxGeometry, Mesh, MeshPhongMaterial, Object3D, PointLight, Vector3 } from "three"
import Diamond from "./Diamond"
import Projector from "./Projector"
import Wall from "./Wall"
import { Updatable } from "./interfaces"
import { debugReflection, palette } from "./const"


export default class Room extends Object3D implements Updatable {
  private diamonds: Diamond[] = []
  private projectors: Projector[] = []
  private walls: Wall[] = []

  constructor() {
    super()

    const wallWidth = 10
    const wallHeight = 15

    for(let i = 0; i < 4; i++) {
      const wall = new Wall(wallWidth, wallHeight, wallWidth/2, i)
      this.walls.push(wall)
      this.add(wall)
    }

    const ceilling = new Wall(wallWidth, wallWidth, 0, 0)
    ceilling.mesh.position.y = wallHeight / 2 - wallWidth / 4
    ceilling.mesh.rotation.y = 0
    ceilling.mesh.rotation.x = Math.PI/2
    this.add(ceilling)

    const floor = new Wall(wallWidth, wallWidth, 0, 0)
    floor.mesh.position.y =  -5
    floor.mesh.rotation.y = 0
    floor.mesh.rotation.x = Math.PI/2
    this.add(floor)

    const pointLight = new PointLight(palette.BRIGHT, 1, undefined, 0.5)
    pointLight.position.set(0, 0.5, 0)
    this.add(pointLight)

    const NB_DIAMONDS = 5

    const axisY = new Vector3(0, 1, 0)

    const heightRange = 1
    const clusterRadius = 0.4

    const diamondSize = 0.3

    for(let i = 0; i < NB_DIAMONDS; i++) {

      const angle = i * ( 2 * Math.PI / NB_DIAMONDS )

      const y = Math.random() * heightRange
      const z = clusterRadius

      const diamondPosition = new Vector3(0, y, z).applyAxisAngle(axisY, angle)
      const projoPosition = new Vector3(0, y + 2, z + 2).applyAxisAngle(axisY, angle)

      const diamond =  new Diamond(diamondSize, palette.DARK)
      this.add(diamond)
      diamond.position.copy(diamondPosition)
      this.diamonds.push(diamond)

      const projo = new Projector(palette.BRIGHT, undefined, 100)
      projo.position.copy(projoPosition)
      this.projectors.push(projo)
      this.add(projo)
      projo.setTarget(diamond.upperHalf)

      if(debugReflection) {
        const geometry = new BoxGeometry(0.04, 0.04, 0.04)
        const material = new MeshPhongMaterial({ color: 0x0000FF })
        const projoMesh = new Mesh(geometry, material)
        projoMesh.position.copy(projoPosition)
        this.add(projoMesh)
      }
    }
  }

  public update(delta: number): void {
    this.diamonds.forEach(diamond => diamond.update(delta))
    this.projectors.forEach(projector => projector.update(delta))
    this.walls.forEach(wall => wall.update(delta))

    this.projectors.forEach(projector => projector.updateLight(delta))
  }
}
