import { TextureLoader } from "three";


const textureFile = './barknotcouleur_light.png'
// const textureFile = './barknotdark.png'

export const dogTexture = new TextureLoader().load(textureFile, undefined, undefined, (err) => { console.log(err)});
