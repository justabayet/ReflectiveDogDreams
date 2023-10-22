import { ColorRepresentation, Raycaster, SpotLight, TextureLoader, Vector3 } from "three";
import DiamondHalf from "./DiamondHalf";
import { Updatable } from "./interfaces";
import Mirror from "./Mirror";
import { dogTexture } from "./textures";

/**
 * There is one Projector per diamond half.
 * In real life, there would be one big projector with multiple images in circles.
 */
export default class Projector extends SpotLight implements Updatable {
  private raycaster: Raycaster

  private reflection: SpotLight

  private objectTarget: DiamondHalf
  private pointTarget: Vector3

  private lastReflectingMirror: Mirror = undefined

  constructor(spotlightColor: ColorRepresentation = 0xffffff, ...args: any[]) {
    super(...args)

    this.castShadow = true

    this.reflection = new SpotLight(spotlightColor, 100)
    this.reflection.castShadow = true
    this.reflection.map = dogTexture
    this.map = dogTexture
    this.setAngle(0.05)
  }

  public update() {
    this.updateLight()
  }

  public setAngle(angle: number) {
    this.angle = angle
    this.reflection.angle = this.angle
  }

  setTarget(diamondHalf: DiamondHalf, offset?: Vector3) {
    this.target = diamondHalf
    this.objectTarget = diamondHalf

    const position = new Vector3()
    this.getWorldPosition(position)

    const targetPosition = new Vector3()
    diamondHalf.getWorldPosition(targetPosition)

    const delta = targetPosition.clone().sub(position)

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
