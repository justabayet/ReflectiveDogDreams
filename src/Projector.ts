import { BoxGeometry, ColorRepresentation, Mesh, MeshPhongMaterial, Raycaster, SpotLight, Vector3 } from "three"
import DiamondHalf from "./DiamondHalf"
import { Updatable } from "./interfaces"
import Mirror from "./Mirror"
import { ANGLE_MAX, ANGLE_MIN, debugReflection, getTexture, palette } from "./const"

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

  constructor(spotlightColor: ColorRepresentation = 0xffffff, color?: ColorRepresentation, intensity?: number, distance?: number, _?: number, penumbra?: number, decay?: number) {
    if(!color) {
      color = spotlightColor
    }

    super()

    this.reflection = new SpotLight(palette.BRIGHT, 1, undefined, undefined, 0.8, 0)
    this.reflection.position.set(0, 0, 0)


    this.reflection.map = getTexture()

    const angleVariance = ANGLE_MAX - ANGLE_MIN
    const angle = ANGLE_MIN + (angleVariance * Math.random())
    this.setAngle(angle)

    if(debugReflection) {
      const geometry = new BoxGeometry(0.04, 0.04, 0.04)
      const material = new MeshPhongMaterial({ color: 0x0000FF })
      const projoMesh = new Mesh(geometry, material)
      this.add(projoMesh)
    }
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
