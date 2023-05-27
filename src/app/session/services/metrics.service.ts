import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { TimeSeriesSample } from '../models/time-series-sample'

const SECONDS_PER_MINUTE = 60

@Injectable()
export class MetricsService {
  private readonly samples: TimeSeriesSample[] = []
  readonly timeSeries$: Observable<TimeSeriesSample[]> = of(this.samples)

  private characterCount = 0
  private wordCount = 0
  private errorCount = 0

  sample(deltaSeconds: number) {
    const sample: TimeSeriesSample = {
      deltaSeconds,
      characterCount: this.characterCount,
      wordCount: this.wordCount,
      errorCount: this.errorCount,
      accuracy: 1 - this.errorCount / this.characterCount,
      wpm:
        deltaSeconds === 0
          ? 0
          : (this.wordCount / deltaSeconds) * SECONDS_PER_MINUTE,
      cpm:
        deltaSeconds === 0
          ? 0
          : (this.characterCount / deltaSeconds) * SECONDS_PER_MINUTE,
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
