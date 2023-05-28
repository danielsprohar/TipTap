import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MatDialogModule } from '@angular/material/dialog'
import { ActivatedRoute } from '@angular/router'
import { of } from 'rxjs'
import { ActivatedRouteStub } from '../../testing/activated-route-stub'
import { Finger, Hand, Level } from '../enums'
import { Lesson } from '../models/lesson'
import { KeyboardService } from './services/keyboard.service'
import { SessionService } from './services/session.service'
import { SessionComponent } from './session.component'

describe('SessionComponent', () => {
  let component: SessionComponent
  let fixture: ComponentFixture<SessionComponent>
  let routeStub = new ActivatedRouteStub()
  let sessionService: jasmine.SpyObj<SessionService>
  let keyboardService: jasmine.SpyObj<KeyboardService>
  const lesson =  new Lesson({
    level: Level.BEGINNER,
    hand: Hand.LEFT,
    finger: Finger.PINKY,
  })

  beforeEach(async () => {
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
    component.lesson$ = of(lesson)
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
