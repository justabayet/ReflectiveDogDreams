import { BoxGeometry, Mesh, MeshPhongMaterial, Object3D } from "three";
import { Direction, Updatable } from "./interfaces";



export default class Wall extends Object3D implements Updatable {
  private width: number
  private height: number
  private distance: number
  private direction: Direction
  private mesh: Mesh

  constructor(width: number, height: number, distance: number, direction: Direction ) {
    super()

    this.width = width
    this.height = height
    this.distance = distance
    this.direction = direction

    const geometryWall = new BoxGeometry(this.width, this.height, 0.1)
    const materialWall = new MeshPhongMaterial()

    this.mesh = new Mesh(geometryWall, materialWall)

    this.mesh.receiveShadow = true

    this.mesh.position.x = - this.distance
    this.mesh.position.y = 0//this.height / 2
    this.mesh.position.z = 0

    this.mesh.rotation.y -= Math.PI/2

    this.rotation.y -= Math.PI/2 * this.direction

    this.add(this.mesh)

  }

  public update() {}
}
