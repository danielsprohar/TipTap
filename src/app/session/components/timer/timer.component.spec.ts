import {
  ComponentFixture,
  TestBed,
  discardPeriodicTasks,
  fakeAsync,
  tick,
} from '@angular/core/testing'

import { MetricsService, SessionService } from '../../services'
import { TimerComponent } from './timer.component'

describe('TimerComponent', () => {
  let component: TimerComponent
  let fixture: ComponentFixture<TimerComponent>
  const sessionService = new SessionService(new MetricsService())

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TimerComponent],
      providers: [
        {
          provide: SessionService,
          // useValue: sessionServiceSpy,
          useValue: sessionService,
        },
      ],
    })
    fixture = TestBed.createComponent(TimerComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should render the timer', fakeAsync(() => {
    const compiled = fixture.nativeElement
    sessionService.start()

    tick(1000)
    fixture.detectChanges()

    const element: Element = compiled.querySelector('.time')
    if (element.textContent === null) {
      fail('textContent should not be null')
    }

    expect(Number.parseInt(element.textContent!))
      .withContext('First check')
      .toEqual(sessionService.getDurationSeconds() - 1)

    tick(1000)
    fixture.detectChanges()

    expect(Number.parseInt(element.textContent!))
      .withContext('Second check')
      .toEqual(sessionService.getDurationSeconds() - 2)

    discardPeriodicTasks()
  }))
})
