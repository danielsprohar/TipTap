import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MatDialogModule } from '@angular/material/dialog'
import { ActivatedRoute } from '@angular/router'
import { of } from 'rxjs'
import { ActivatedRouteStub } from 'src/testing/activated-route-stub'
import { Lesson } from '../models/lesson'
import { Metrica } from './models/metrica'
import { KeyboardService } from './services/keyboard.service'
import { SessionService } from './services/session.service'
import { SessionComponent } from './session.component'

describe('SessionComponent', () => {
  let component: SessionComponent
  let fixture: ComponentFixture<SessionComponent>
  let routeStub = new ActivatedRouteStub()
  let mockLesson: Lesson
  let sessionService: jasmine.SpyObj<SessionService>
  let keyboardService: jasmine.SpyObj<KeyboardService>

  beforeEach(async () => {
    mockLesson = new Lesson({
      level: 'beginner',
      hand: 'left',
      finger: 'pinky',
    })

    sessionService = jasmine.createSpyObj(
      'SessionService',
      ['calcWordsPerMinute'],
      {
        metrica$: of(new Metrica()),
        reset$: of(false),
        duration: 60,
        metrica: new Metrica(),
      }
    )

    await TestBed.configureTestingModule({
    imports: [MatDialogModule, SessionComponent],
    providers: [
        {
            provide: ActivatedRoute,
            useValue: routeStub,
        },
        {
            provide: SessionService,
            useValue: sessionService,
        },
        {
            provide: KeyboardService,
            useValue: keyboardService,
        },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
}).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should render the mock lesson', (done: DoneFn) => {
    routeStub.setQueryParamMap(mockLesson.toQueryParams())

    component.lesson$?.subscribe((lesson: Lesson) => {
      expect(lesson).toEqual(mockLesson)
      expect(lesson.toQueryParams()).toEqual(mockLesson.toQueryParams())
      done()
    })
  })
})
