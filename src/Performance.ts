import { Updatable } from "./interfaces"

const ITERATION: number = 120
const ITERATION_BASELINE: number = 100

export default class Performance implements Updatable {
  private counter: number = 0
  private bestFps: number = 0

  private values: number[] = []
  private baseLineValues: number[] = []

  public isSettled: boolean = false

  update(delta: number) {
    const fps = 1000 / delta
    this.counter++

    if(this.counter <= ITERATION_BASELINE) {
      // Compute best fps
      this.baseLineValues.push(fps)

      if(this.counter === ITERATION_BASELINE) {
        this.bestFps = getMedian(this.baseLineValues)
      }

    } else {
      this.values.push(fps)

      if((this.counter - 10) % ITERATION === 0) {
        // Compute if there has been a degradation
        const median = getMedian(this.values)

        console.log(median, this.bestFps)

        const hasDegradated = 0.97 * this.bestFps > median

        if(hasDegradated) this.isSettled = true

        this.values = []

        return hasDegradated
      }
    }
  }
}

function getMedian(values: number[]): number {
  if (values.length === 0) {
    throw new Error('Input array is empty')
  }

  values = [...values].sort((a, b) => a - b)

  const half = Math.floor(values.length / 2)

  return (values.length % 2
    ? values[half]
    : (values[half - 1] + values[half]) / 2
  )

}
