import { ColorRepresentation, Object3D } from "three"
import DiamondHalf from "./DiamondHalf"
import { Updatable } from "./interfaces"

const baseRotationSpeed = 0.00005
const variance = baseRotationSpeed / 5

export default class Diamond extends Object3D implements Updatable {
  upperHalf: DiamondHalf
  lowerHalf: DiamondHalf

  public reverseRotation: boolean = false
  rotationSpeed: number = baseRotationSpeed

  constructor(size: number = 2, color: ColorRepresentation = 0xaaaaff) {
    super()

    this.reverseRotation = Math.random() > 0.5

    const varianceSolved = (Math.random() * variance) - variance / 2
    this.rotationSpeed += varianceSolved

    this.upperHalf = new DiamondHalf(size, color)
    this.add(this.upperHalf)

    this.lowerHalf = new DiamondHalf(size, color)
    this.add(this.lowerHalf)
    this.lowerHalf.rotateX(Math.PI)
  }

  public update(delta: number) {
    let rotation = this.reverseRotation ? -this.rotationSpeed : this.rotationSpeed
    rotation *= delta

    this.rotateY(rotation)
    this.upperHalf?.update(delta)
    this.lowerHalf?.update(delta)
  }
}
