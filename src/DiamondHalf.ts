import { ColorRepresentation, Object3D } from "three"
import Mirror from "./Mirror"
import { Updatable } from "./interfaces"


export default class DiamondHalf extends Object3D implements Updatable {
  private mirrors: Mirror[] = []

  constructor(size: number = 2, color: ColorRepresentation = 0xaaaaff) {
    super()

    for(let i = 0; i < 4; i++) {
      const mirror = new Mirror(size, i, color)
      this.mirrors.push(mirror)
      this.add(mirror)
    }
  }

  public getMirrors(): Mirror[] {
    return this.mirrors
  }

  public update(delta: number) {}
}
