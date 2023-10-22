import { DoubleSide, Mesh, MeshPhongMaterial, Object3D, Plane, PlaneGeometry, Shape, ShapeGeometry, SpotLight, Triangle, Vector3 } from "three";
import Diamond from "./Diamond";
import Projector from "./Projector";
import Wall from "./Wall";
import { Direction, Updatable } from "./interfaces";


export default class Room extends Object3D implements Updatable {
  private diamonds: Diamond[] = []
  private projectors: Projector[] = []
  private walls: Wall[] = []

  constructor() {
    super()

    for(let i = 0; i < 4; i++) {
      const wall = new Wall(14, 6, 7, i)
      this.walls.push(wall)
      this.add(wall)
    }

    const diamond =  new Diamond(1)
    this.add(diamond)
    diamond.position.set(1, 0, 1)
    this.diamonds.push(diamond)

    const projo = new Projector(0x00FF00, 0x00FF00, 10)
    projo.position.set(4, 0.7, 2)
    this.projectors.push(projo)
    this.add(projo)
    projo.setTarget(diamond.upperHalf)

    const projo2 = new Projector(0xFF0000, 0xFF0000, 10)
    projo2.position.set(4, -0.7, 2)
    this.projectors.push(projo2)
    this.add(projo2)
    projo2.setTarget(diamond.lowerHalf)

    const diamond2 =  new Diamond()
    this.add(diamond2)
    diamond2.reverseRotation = true
    diamond2.position.set(-1, 0, 1)
    this.diamonds.push(diamond2)

    const projo3 = new Projector(0x0000FF, 0x0000FF, 10)
    projo3.position.set(-2, -0.1, 5)
    projo3.setAngle(0.2)
    this.projectors.push(projo3)
    this.add(projo3)
    projo3.setTarget(diamond2.lowerHalf)


    // Diamond
    // const point = Diamond.getPointInUpperWalls()

    // Projector
    // Projector.setTarget(diamond.upperHalf, new Vector(0, 0, 0.1))



    const spotLight = new SpotLight(0xFF0000, 1, undefined, undefined, undefined, 1)
    spotLight.castShadow = true
    spotLight.position.set(-5, 3, 3)
    spotLight.lookAt(0, 0, 0)
    spotLight.angle = 1
    this.add(spotLight)
  }

  public update(): void {
    this.diamonds.forEach(diamond => diamond.update())
    this.projectors.forEach(projector => projector.update())
    this.walls.forEach(wall => wall.update())

    this.projectors.forEach(projector => projector.updateLight())
  }
}
