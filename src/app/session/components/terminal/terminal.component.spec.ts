import { ComponentFixture, TestBed } from '@angular/core/testing'
import { of } from 'rxjs'

import {
  KeyboardService,
  RandomWordGeneratorService,
  SessionService,
} from '../../services'
import { TerminalComponent } from './terminal.component'

describe('TerminalComponent', () => {
  const defaultText = 'hello world'
  let component: TerminalComponent
  let fixture: ComponentFixture<TerminalComponent>

  let keyboardSpy: jasmine.SpyObj<KeyboardService>
  let sessionSpy: jasmine.SpyObj<SessionService>
  let rwgSpy: jasmine.SpyObj<RandomWordGeneratorService>

  beforeEach(async () => {
    keyboardSpy = jasmine.createSpyObj('KeyboardService', ['setHighlightKey'], {
      event$: of(new KeyboardEvent('keydown', { key: '' })),
    })

    sessionSpy = jasmine.createSpyObj(
      'SessionService',
      ['incrementErrorCount', 'incrementWordCount', 'incrementCharacterCount'],
      {
        // https://stackoverflow.com/questions/64560390/jasmine-createspyobj-with-properties
        reset$: of(false),
      }
    )

    rwgSpy = jasmine.createSpyObj('RandomWordGeneratorService', [
      'createSessionText',
    ])

    await TestBed.configureTestingModule({
      imports: [TerminalComponent],
      providers: [
        { provide: KeyboardService, useValue: keyboardSpy },
        { provide: SessionService, useValue: sessionSpy },
        { provide: RandomWordGeneratorService, useValue: rwgSpy },
      ],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminalComponent)
    component = fixture.componentInstance
    component.queue = defaultText
    fixture.detectChanges()
  })
})
