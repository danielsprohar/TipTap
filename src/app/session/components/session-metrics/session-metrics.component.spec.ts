import { ComponentFixture, TestBed } from '@angular/core/testing'

import { MetricsService, SessionService } from '../../services'
import { SessionMetricsComponent } from './session-metrics.component'

describe('SessionMetricsComponent', () => {
  let component: SessionMetricsComponent
  let fixture: ComponentFixture<SessionMetricsComponent>
  const metricsService = new MetricsService()
  const sessionService = new SessionService(metricsService)

  sessionService.setLesson({} as any)
  metricsService.setErrorCount(2)
  metricsService.incrementCharacterCount()
  metricsService.incrementCharacterCount()
  metricsService.incrementCharacterCount()
  metricsService.incrementCharacterCount()
  metricsService.incrementCharacterCount()
  metricsService.incrementWordCount()
  metricsService.incrementErrorCount()

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SessionMetricsComponent],
      providers: [
        { provide: MetricsService, useValue: metricsService },
        { provide: SessionService, useValue: sessionService },
      ],
    })

    fixture = TestBed.createComponent(SessionMetricsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should render the metrics', () => {
    sessionService.stop()
    fixture.detectChanges()

    const compiled: Element = fixture.nativeElement
    const lineChart: Element | null = compiled.querySelector(
      'tiptap-metrics-line-chart'
    )

    expect(lineChart).toBeTruthy()

    const table: Element | null = compiled.querySelector('tiptap-metrics-table')

    expect(table).toBeTruthy()
  })
})
