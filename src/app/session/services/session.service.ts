import { Injectable } from '@angular/core'
import { Subject, timer } from 'rxjs'
import { Metrica } from '../models/metrica'
import { MetricsService } from './metrics.service'

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private readonly showResultsSubject = new Subject<Metrica>()
  private readonly resetSubject = new Subject<boolean>()
  private readonly sessionDuration = 60

  constructor(private readonly metricsService: MetricsService) {}

  get timer$() {
    return timer(this.sessionDuration)
  }

  get duration() {
    return this.sessionDuration
  }

  get results$() {
    return this.showResultsSubject.asObservable()
  }

  get reset$() {
    return this.resetSubject.asObservable()
  }

  reset() {
    this.resetSubject.next(true)
    this.metricsService.reset()
  }
}
