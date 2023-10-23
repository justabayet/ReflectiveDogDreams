import { VideoTexture } from "three"

const videosTexture: VideoTexture[] = []

for(let i = 1; i <= 5; i++) {
  const video = document.getElementById( `video${i}` ) as HTMLVideoElement
  video.play()
  const videoTexture = new VideoTexture( video )
  videosTexture.push(videoTexture)
}

let textureCounter = 0
export function getTexture() {
  textureCounter++
  return videosTexture[textureCounter % videosTexture.length]
}


// palette : #FCF5ED #F4BF96 #CE5A67 #1F1717
// https://colorhunt.co/palette/fcf5edf4bf96ce5a671f1717

export const palette = {
  VERY_BRIGHT: 0xFCF5ED,
  BRIGHT: 0xF4BF96,
  PRIMARY: 0xCE5A67,
  DARK: 0x7a5a5a,
  // DARK: 0x1F1717,
}
