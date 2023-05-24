export class Timer {
  isTicking: boolean = false
  value: number = 0
  // TODO: Set default session length
  stopAt?: number

  constructor(props?: {
    isTicking?: boolean
    value?: number
    stopAt?: number
  }) {
    if (props) {
      Object.assign(this, props)
    }
  }
}
