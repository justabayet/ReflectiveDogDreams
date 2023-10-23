export interface Updatable {
  update: (delta: number) => void
}

export enum Direction {
  NORTH,
  SOUTH,
  WEST,
  EAST
}
