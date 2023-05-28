import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { TimeSeriesSample } from '../models/time-series-sample'

@Injectable()
export class MetricsService {
  private _characterCount = 0
  private _wordCount = 0
  private _errorCount = 0
  private _totalErrors = 0

  private readonly _samples: TimeSeriesSample[] = []
  readonly timeSeries$: Observable<TimeSeriesSample[]> = of(this._samples)

  get totalCharacters() {
    return this._characterCount
  }

  get totalWords() {
    return this._wordCount
  }

  get totalErrors() {
    return this._totalErrors
  }

  setErrorCount(value: number) {
    this._errorCount = value
  }

  sample(timeSeconds: number, wordSize: number) {
    let cpm = 0
    let rawWPM = 0
    let netWPM = 0

    if (timeSeconds > 0) {
      cpm = (this._characterCount / timeSeconds) * 60
      rawWPM = cpm / wordSize
      netWPM = rawWPM - this._errorCount / (timeSeconds / 60)
    }

    const sample: TimeSeriesSample = {
      timeSeconds,
      errors: this._errorCount,
      rawWPM,
      netWPM,
    }

    this._samples.push(sample)
    this._errorCount = 0
  }

  decrementWordCount() {
    this._wordCount--
  }

  decrementCharacterCount() {
    this._characterCount--
  }

  decrementErrorCount() {
    this._errorCount--
  }

  incrementCharacterCount() {
    this._characterCount++
  }

  incrementWordCount() {
    this._wordCount++
  }

  incrementErrorCount() {
    this._errorCount++
  }

  reset() {
    this._samples.length = 0
    this._characterCount = 0
    this._wordCount = 0
    this._errorCount = 0
  }
}
