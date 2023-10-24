import { BoxGeometry, ColorRepresentation, Intersection, Mesh, MeshPhongMaterial, Object3D, SpotLight, Vector3 } from "three"
import { Direction, Updatable } from "./interfaces"
import TriangleMesh from "./TriangleMesh"
import { debugReflection } from "./const"


export default class Mirror extends TriangleMesh implements Updatable  {
  private helperIntersection: Object3D
  private targetReflection: Object3D

  private meshProjoReflected: Mesh
  private meshTargetProjoReflected: Mesh

  private projoReflected?: SpotLight

  public exposition: Direction

  constructor(size: number = 2, direction: Direction, color: ColorRepresentation = 0xff9900) {
    super(size, color)

    this.exposition = direction

    this.rotateY(-Math.PI/2 * direction)
    this.rotateX(Math.PI/2 - Math.PI/ 3)

    const axis = new Vector3(0, 0, -(size / 2)).applyAxisAngle(new Vector3(0, 1, 0),-Math.PI / 2 * direction)
    this.position.copy(axis)

    this.helperIntersection = new Object3D()
    this.helperIntersection.position.set(0, 0, 0)
    this.add(this.helperIntersection)

    this.targetReflection = new Object3D()

    this.helperIntersection.add(this.targetReflection)

    if (debugReflection) {
      const geometry = new BoxGeometry(0.04, 0.04, 0.04)
      const material = new MeshPhongMaterial({ color: 0xFF0000 })
      this.meshTargetProjoReflected = new Mesh(geometry, material)
      this.helperIntersection.add(this.meshTargetProjoReflected)
    }
  }

  public hasProjo(): boolean {
    return !!this.projoReflected
  }

  public setProjo(projector: SpotLight) {
    if(this.hasProjo()) {
      this.removeProjo()
    }

    this.projoReflected = projector
    this.projoReflected.target = this.targetReflection
    this.helperIntersection.add(this.projoReflected)

    if(debugReflection) {
      const geometry = new BoxGeometry(0.04, 0.04, 0.04)
      const material = new MeshPhongMaterial()
      this.meshProjoReflected = new Mesh(geometry, material)

      this.helperIntersection.add(this.meshProjoReflected)
    }
  }

  public removeProjo() {
    if(debugReflection) this.helperIntersection.remove(this.meshProjoReflected)
    this.helperIntersection.remove(this.projoReflected)
    this.projoReflected = undefined
  }

  public updateReflection(intersection: Intersection<Mirror>, projectorPosition: Vector3) {
    const projectorPositionLocal = this.worldToLocal(projectorPosition.clone())

    const intersectionPosition = this.worldToLocal(intersection.point.clone())
    this.helperIntersection.position.copy(intersectionPosition)

    this.targetReflection.position.copy(projectorPositionLocal)
    this.targetReflection.position.x *= -1
    this.targetReflection.position.y *= -1

    if(debugReflection) this.meshTargetProjoReflected.position.copy(this.targetReflection.position)
  }
}
