import { ColorRepresentation, DoubleSide, Mesh, MeshPhongMaterial, Shape, ShapeGeometry } from "three";
import { Updatable } from "./interfaces";


export default class TriangleMesh extends Mesh implements Updatable {

  constructor(size: number = 2, color: ColorRepresentation) {
    const shape = new Shape();

    const unit = size / 2
    const x = 0;
    const y = unit;

    shape.moveTo(x - unit, y - unit);
    shape.lineTo(x + unit, y - unit);
    shape.lineTo(x, y + unit);

    const triangleGeometry = new ShapeGeometry(shape);

    const material = new MeshPhongMaterial({ color })
    material.side = DoubleSide

    super(triangleGeometry, material)
  }

  update() {}
}
