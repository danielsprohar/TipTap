import { TestBed } from '@angular/core/testing'

import { MetricsService } from './metrics.service'
import { SessionSample } from '../models/time-series-sample'

describe('MetricsService', () => {
  let service: MetricsService

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MetricsService],
    })
    service = TestBed.inject(MetricsService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should increment the character count', () => {
    service.incrementCharacterCount()
    expect(service.getTotalCharacters()).toEqual(1)
  })

  it('should increment the word count', () => {
    service.incrementWordCount()
    expect(service.getTotalWords()).toEqual(1)
  })

  it('should increment the error count', () => {
    service.incrementErrorCount()
    expect(service.getTotalErrors()).toEqual(1)
  })

  it('should set the words with errors count', () => {
    service.setWordsErrorCount(1)
    expect(service.getTotalWordsWithErrors()).toEqual(1)
  })

  it('should set the words attempted count', () => {
    service.setWordsAttemptedCount(1)
    expect(service.getTotalWordsAttempted()).toEqual(1)
  })

  it('should get the accuracy', () => {
    service.incrementCharacterCount()
    service.incrementCharacterCount()
    service.incrementErrorCount()

    expect(service.getAccuracy()).toEqual(0.5)
  })

  it('should sample', (done: DoneFn) => {
    const timeSeconds = 1
    const wordSize = 5

    service.incrementCharacterCount()
    service.incrementCharacterCount()
    service.incrementErrorCount()
    service.sample(timeSeconds, wordSize)

    const subscription = service.timeSeries$.subscribe(
      (samples: SessionSample[]) => {
        expect(samples.length).withContext('Number of samples').toEqual(1)

        const sample: SessionSample = samples[0]
        expect(sample.timeSeconds)
          .withContext('Time in seconds')
          .toEqual(timeSeconds)

        expect(sample.errors).withContext('Number of errors').toEqual(1)

        const cpm = (service.getTotalCharacters() / timeSeconds) * 60
        const raw = cpm / wordSize
        const wpm = raw - (sample.errors / (timeSeconds * 60))

        expect(sample.cpm).withContext('CPM').toEqual(cpm)
        expect(sample.rawWPM).withContext('Raw WPM').toEqual(raw)
        expect(sample.netWPM).withContext('Net WPM').toEqual(wpm)

        done()
      }
    )

    subscription.unsubscribe()
  })
})
