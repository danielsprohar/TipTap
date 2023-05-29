import { MathUtil } from '../utils/math-util'

export class SessionResults {
  constructor(
    public readonly wordSize: number,
    public readonly cpm: number,
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
  private _totalErrors?: number
  private _totalCharacters?: number
  private _totalWords?: number
  private _totalWordsWithErrors?: number
  private _accuracy?: number
  private _durationSeconds?: number
  private _wordSize: number = 5
  private _startedAt?: Date
  private _completedAt?: Date

  totalErrors(errors: number) {
    this._totalErrors = errors
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

  wordSize(value: number) {
    this._wordSize = value
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
    if (this._totalErrors === undefined) {
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

    if (this._wordSize === undefined) {
      throw new Error('Word Size is required')
    }

    if (this._startedAt === undefined) {
      throw new Error('Started at is required')
    }

    if (this._completedAt === undefined) {
      throw new Error('Completed at is required')
    }

    const cpm = MathUtil.calulateCPM(this._totalCharacters, this._durationSeconds)
    const rawWPM = MathUtil.calculateRawWPM(
      this._totalCharacters,
      this._wordSize,
      this._durationSeconds
    )
    const netWPM = MathUtil.calculateNetWPM(
      this._totalCharacters,
      this._totalErrors,
      this._wordSize,
      this._durationSeconds
    )

    return new SessionResults(
      this._wordSize,
      cpm,
      rawWPM,
      netWPM,
      this._totalErrors,
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
