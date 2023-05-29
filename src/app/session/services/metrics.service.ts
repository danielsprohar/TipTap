import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { SessionSample } from '../models/time-series-sample'
import { MathUtil } from '../utils/math-util'

@Injectable()
export class MetricsService {
  private _characterCount = 0
  private _wordCount = 0
  private _totalErrors = 0
  private _wordsAttemptedCount = 0
  private _wordsWithErrorsCount = 0

  private readonly _samples: SessionSample[] = []
  readonly timeSeries$: Observable<SessionSample[]> = of(this._samples)

  getTotalCharacters() {
    return this._characterCount
  }

  getTotalWords() {
    return this._wordCount
  }

  getTotalErrors() {
    return this._totalErrors
  }

  getTotalWordsWithErrors() {
    return this._wordsWithErrorsCount
  }

  getTotalWordsAttempted() {
    return this._wordsAttemptedCount
  }

  getAccuracy() {
    return this._characterCount > 0
      ? (this._characterCount - this._totalErrors) / this._characterCount
      : 0
  }

  setWordsAttemptedCount(value: number) {
    this._wordsAttemptedCount = value
  }

  setWordsErrorCount(value: number) {
    this._wordsWithErrorsCount = value
  }

  sample(timeSeconds: number, wordSize: number) {
    let cpm = 0
    let rawWPM = 0
    let netWPM = 0

    if (timeSeconds > 0) {
      cpm = MathUtil.calulateCPM(this._characterCount, timeSeconds)
      rawWPM = MathUtil.calculateRawWPMFromCPM(cpm, wordSize)
      netWPM = MathUtil.calculateNetWPMFromRawWPM(
        rawWPM,
        this._totalErrors,
        timeSeconds
      )
    }

    const sample: SessionSample = {
      timeSeconds,
      errors: this._totalErrors,
      cpm,
      rawWPM,
      netWPM,
    }

    this._samples.push(sample)
  }

  decrementWordCount() {
    this._wordCount--
  }

  decrementCharacterCount() {
    this._characterCount--
  }

  decrementErrorCount() {
    this._totalErrors--
  }

  incrementCharacterCount() {
    this._characterCount++
  }

  incrementWordCount() {
    this._wordCount++
  }

  incrementErrorCount() {
    this._totalErrors++
    this._totalErrors++
  }

  reset() {
    this._samples.length = 0
    this._characterCount = 0
    this._wordCount = 0
    this._totalErrors = 0
  }
}
