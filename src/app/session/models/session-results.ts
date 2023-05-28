import { Lesson } from '../../models'

export class SessionResults {
  private readonly _rawWPM: number
  private readonly _netWPM: number

  constructor(
    public readonly lesson: Lesson,
    public readonly errors: number,
    public readonly totalCharacters: number,
    public readonly accuracy: number,
    public readonly duration: number,
    public readonly startedAt: Date,
    public readonly completedAt: Date
  ) {
    // Calculate the raw WPM
    this._rawWPM = this.totalCharacters / 5 / (this.duration / 60)

    // Calculate the net WPM
    this._netWPM = this._rawWPM - this.errors / (this.duration / 60)
  }

  get rawWPM() {
    return this._rawWPM
  }

  get netWPM() {
    return this._netWPM
  }

  static builder(): SessionResultsBuilder {
    return new SessionResultsBuilder()
  }
}

class SessionResultsBuilder {
  private _lesson?: Lesson
  private _errors?: number
  private _totalCharacters?: number
  private _accuracy?: number
  private _duration?: number
  private _startedAt?: Date
  private _completedAt?: Date

  lesson(lesson: Lesson) {
    this._lesson = lesson
    return this
  }

  errors(errors: number) {
    this._errors = errors
    return this
  }

  accuracy(accuracy: number) {
    this._accuracy = accuracy
    return this
  }

  duration(duration: number) {
    this._duration = duration
    return this
  }

  startedAt(startedAt: Date) {
    this._startedAt = startedAt
    return this
  }

  completedAt(completedAt: Date) {
    this._completedAt = completedAt
    return this
  }

  build() {
    if (this._lesson === undefined) {
      throw new Error('Lesson is required')
    }

    if (this._errors === undefined) {
      throw new Error('Errors is required')
    }

    if (this._totalCharacters === undefined) {
      throw new Error('Total characters is required')
    }

    if (this._accuracy === undefined) {
      throw new Error('Accuracy is required')
    }

    if (this._duration === undefined) {
      throw new Error('Duration is required')
    }

    if (this._startedAt === undefined) {
      throw new Error('Started at is required')
    }

    if (this._completedAt === undefined) {
      throw new Error('Completed at is required')
    }

    return new SessionResults(
      this._lesson,
      this._errors,
      this._totalCharacters,
      this._accuracy,
      this._duration,
      this._startedAt,
      this._completedAt
    )
  }
}
