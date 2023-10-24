import { ColorRepresentation, Mesh, Raycaster, SpotLight, Vector3 } from "three"
import DiamondHalf from "./DiamondHalf"
import { Updatable } from "./interfaces"
import Mirror from "./Mirror"
import { getTexture } from "./const"

/**
 * There is one Projector per diamond half.
 * In real life, there would be one big projector with multiple images in circles.
 */
export default class Projector extends Mesh implements Updatable {
  private raycaster: Raycaster

  private reflection: SpotLight

  private objectTarget: DiamondHalf
  private pointTarget: Vector3

  private lastReflectingMirror: Mirror = undefined

  constructor(spotlightColor: ColorRepresentation = 0xffffff, color?: ColorRepresentation, intensity?: number, distance?: number, angle?: number, penumbra?: number, decay?: number) {
    if(!color) {
      color = spotlightColor
    }

    super()

    this.reflection = new SpotLight(spotlightColor, 2, undefined, undefined, 0.2, 0)
    this.reflection.position.set(0, 0, 0)

    this.reflection.map = getTexture()
    this.setAngle(0.3)
  }

  public update(delta: number) {
    this.updateLight()
  }

  public setAngle(angle: number) {
    // this.angle = angle / 5
    this.reflection.angle = angle
  }

  setTarget(diamondHalf: DiamondHalf, offset?: Vector3) {
    // this.target = diamondHalf
    this.objectTarget = diamondHalf

    const position = new Vector3()
    this.getWorldPosition(position)

    const targetPosition = new Vector3()
    diamondHalf.getWorldPosition(targetPosition)

    const delta = targetPosition.clone().sub(position)

    // this.distance = position.distanceTo(targetPosition) + 1

    this.raycaster = new Raycaster(position, delta)

    // Compute pointTarget
    // set pointTarget

    // Get direction from this.position to pointTarget.position
    // this.raycaster.set(this.position, direction)
    // this.lookAt(pointTarget)
  }

  updateLight() {
    const position = new Vector3()
    this.getWorldPosition(position)

    const intersections = this.raycaster.intersectObjects<Mirror>(this.objectTarget.getMirrors(), false)

    if(intersections.length > 0) {
      const intersection = intersections[0]
      const mirror = intersection.object

      if(mirror !== this.lastReflectingMirror) {
        this.lastReflectingMirror?.removeProjo()
        mirror.setProjo(this.reflection)
      }

      mirror.updateReflection(intersection, position)
      this.lastReflectingMirror = mirror
    }
  }
}
