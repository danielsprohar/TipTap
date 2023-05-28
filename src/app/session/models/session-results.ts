import { Lesson } from '../../models'

export class SessionResults {
  constructor(
    public readonly lesson: Lesson,
    public readonly rawWPM: number,
    public readonly netWPM: number,
    public readonly errors: number,
    public readonly totalCharacters: number,
    public readonly totalWords: number,
    public readonly totalWordsWithErrors: number,
    public readonly accuracy: number,
    public readonly durationSeconds: number,
    public readonly startedAt: Date,
    public readonly completedAt: Date
  ) {}

  static builder(): SessionResultsBuilder {
    return new SessionResultsBuilder()
  }
}

class SessionResultsBuilder {
  private _lesson?: Lesson
  private _errors?: number
  private _totalCharacters?: number
  private _totalWords?: number
  private _totalWordsWithErrors?: number
  private _accuracy?: number
  private _durationSeconds?: number
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

  totalCharacters(totalCharacters: number) {
    this._totalCharacters = totalCharacters
    return this
  }

  totalWords(totalWords: number) {
    this._totalWords = totalWords
    return this
  }

  totalWordsWithErrors(totalWordsWithErrors: number) {
    this._totalWordsWithErrors = totalWordsWithErrors
    return this
  }

  accuracy(accuracy: number) {
    this._accuracy = accuracy
    return this
  }

  durationSeconds(duration: number) {
    this._durationSeconds = duration
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

    if (this._totalWords === undefined) {
      throw new Error('Total words is required')
    }

    if (this._totalWordsWithErrors === undefined) {
      throw new Error('Total words with errors is required')
    }

    if (this._accuracy === undefined) {
      throw new Error('Accuracy is required')
    }

    if (this._durationSeconds === undefined) {
      throw new Error('Duration is required')
    }

    if (this._startedAt === undefined) {
      throw new Error('Started at is required')
    }

    if (this._completedAt === undefined) {
      throw new Error('Completed at is required')
    }

    const rawWPM = this._totalCharacters / 5 / (this._durationSeconds / 60)
    const netWPM = rawWPM - this._errors / (this._durationSeconds / 60)

    return new SessionResults(
      this._lesson,
      rawWPM,
      netWPM,
      this._errors,
      this._totalCharacters,
      this._totalWords,
      this._totalWordsWithErrors,
      this._accuracy,
      this._durationSeconds,
      this._startedAt,
      this._completedAt
    )
  }
}
