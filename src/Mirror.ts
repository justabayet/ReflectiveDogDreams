import { ColorRepresentation, Intersection, Object3D, SpotLight, Vector3 } from "three"
import { Direction, Updatable } from "./interfaces"
import TriangleMesh from "./TriangleMesh"


export default class Mirror extends TriangleMesh implements Updatable  {
  private helperIntersection: Object3D
  private targetReflection: Object3D

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
    // this.projoReflected.position.x -= 0.1
    this.helperIntersection.add(this.projoReflected)
  }

  public removeProjo() {
    this.helperIntersection.remove(this.projoReflected)
    this.projoReflected = undefined
  }

  public updateReflection(intersection: Intersection<Mirror>, projectorPosition: Vector3) {
    const projectorPositionLocal = this.worldToLocal(projectorPosition.clone())

    const intersectionPosition = this.worldToLocal(intersection.point.clone())
    this.helperIntersection.position.copy(intersectionPosition)

    this.targetReflection.position.copy(projectorPositionLocal)
    this.targetReflection.position.x *= -1
    // this.targetReflection.position.y *= -1
  }
}
