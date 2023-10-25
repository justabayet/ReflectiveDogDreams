import { Object3D, PointLight, Vector3 } from "three"
import Diamond from "./Diamond"
import Projector from "./Projector"
import Wall from "./Wall"
import { Updatable } from "./interfaces"
import { palette } from "./const"
import Performance from "./Performance"

const NB_DIAMONDS_MAX = 10
const AXIS_Y = new Vector3(0, 1, 0)
export default class Room extends Object3D implements Updatable {
  private diamonds: Diamond[] = []
  private projectors: Projector[] = []
  private walls: Wall[] = []

  private nbDiamond: number = 1

  private performance: Performance

  private HEIGHT_RANGE = 3
  private CLUSTER_RADIUS = 0.4

  private DIAMOND_SIZE = 0.3

  constructor() {
    super()

    this.performance = new Performance()

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

    const pointLight = new PointLight(palette.BRIGHT, 0.5, undefined, 1)
    pointLight.position.set(0, 0.5, 0)
    this.add(pointLight)
  }

  private addDiamond() {
    const angle = this.nbDiamond * ( 2 * Math.PI / (NB_DIAMONDS_MAX) )
    const factor = - this.nbDiamond % 2

    const y = Math.random() * this.HEIGHT_RANGE
    const z = this.CLUSTER_RADIUS

    const diamondPosition = new Vector3(0, y, z).applyAxisAngle(AXIS_Y, angle + Math.PI * factor)
    const projoPosition = new Vector3(0, y + 2, z + 2).applyAxisAngle(AXIS_Y, angle + Math.PI * factor)

    const diamond =  new Diamond(this.DIAMOND_SIZE, palette.DARK)
    this.add(diamond)
    diamond.position.copy(diamondPosition)
    this.diamonds.push(diamond)

    const projo = new Projector(palette.BRIGHT, undefined, 100)
    projo.position.copy(projoPosition)
    this.projectors.push(projo)
    this.add(projo)
    projo.setTarget(diamond.upperHalf)

    this.nbDiamond += 1
  }

  private popDiamond() {
    this.projectors.pop().removeFromParent()
    this.diamonds.pop().removeFromParent()

    this.nbDiamond -= 1
  }

  public update(delta: number): void {
    if(!this.performance.isSettled){
      const hasDegradated = this.performance.update(delta)

      if(typeof hasDegradated !== 'undefined') {
        if(hasDegradated) {
          this.popDiamond()
        } else {
          if(this.nbDiamond < NB_DIAMONDS_MAX) {
            this.addDiamond()
          } else {
            this.performance.isSettled = true
          }
        }
      }
    }

    this.diamonds.forEach(diamond => diamond.update(delta))
    this.projectors.forEach(projector => projector.update(delta))
    this.walls.forEach(wall => wall.update(delta))

    this.projectors.forEach(projector => projector.updateLight())
  }
}
