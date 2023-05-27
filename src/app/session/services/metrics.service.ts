import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { TimeSeriesSample } from '../models/time-series-sample'

@Injectable()
export class MetricsService {
  private readonly samples: TimeSeriesSample[] = []
  readonly timeSeries$: Observable<TimeSeriesSample[]> = of(this.samples)
  private characterCount = 0
  private wordCount = 0
  private errorCount = 0

  sample(deltaSeconds: number, wordSize: number) {
    let cpm = 0
    let wpm = 0

    if (deltaSeconds > 0) {
      cpm = (this.characterCount / deltaSeconds) * 60
      wpm = cpm / wordSize // [characters / min] *  [words / characters] = [words / min]
    }

    const sample: TimeSeriesSample = {
      deltaSeconds,
      characterCount: this.characterCount,
      wordCount: this.wordCount,
      errorCount: this.errorCount,
      cpm,
      wpm,
      accuracy:
        this.characterCount === 0
          ? 1
          : 1 - this.errorCount / this.characterCount,
    }

    this.samples.push(sample)
  }

  incrementCharacterCount(value = 1) {
    this.characterCount += value
  }

  incrementWordCount(value = 1) {
    this.wordCount += value
  }

  incrementErrorCount(value = 1) {
    this.errorCount += value
  }

  reset() {
    this.samples.length = 0
    this.characterCount = 0
    this.wordCount = 0
    this.errorCount = 0
  }
}
