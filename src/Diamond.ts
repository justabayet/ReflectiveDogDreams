import { ColorRepresentation, Object3D } from "three";
import DiamondHalf from "./DiamondHalf";


export default class Diamond extends Object3D {
  upperHalf: DiamondHalf
  lowerHalf: DiamondHalf

  public reverseRotation: boolean = false
  rotationSpeed: number = 0.005

  constructor(size: number = 2, color: ColorRepresentation = 0xaaaaff) {
    super()

    this.upperHalf = new DiamondHalf(size, color)
    this.add(this.upperHalf)

    this.lowerHalf = new DiamondHalf(size, 0x9999cc)
    this.add(this.lowerHalf)
    this.lowerHalf.rotateX(Math.PI)
  }

  public update() {
    this.rotateY(this.reverseRotation ? -this.rotationSpeed : this.rotationSpeed)
    this.upperHalf?.update()
    this.lowerHalf?.update()
  }
}
