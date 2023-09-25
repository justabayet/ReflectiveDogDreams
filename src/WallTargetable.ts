import * as THREE from 'three'


export default class WallTargetable extends THREE.Mesh {

  target: THREE.Mesh = null
  axis: THREE.Vector3 = new THREE.Vector3(0, 0, 0)
}
