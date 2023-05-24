import { ComponentFixture, TestBed } from '@angular/core/testing'
import { of } from 'rxjs'
import { KeyboardService } from '../services/keyboard.service'
import { RandomWordGeneratorService } from '../services/random-word-generator.service'
import { SessionService } from '../services/session.service'

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

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('#reset() should reset the terminal', () => {
    component.queue = 'world'
    component.stack = 'hello '

    component.reset()

    expect(component.queue).toEqual(defaultText)
    expect(component.stack).toEqual('')
  })

  // TODO: Finish test
  // it('#flashTerminal should add the "flash" class to the terminal element', () => {
  //   const element: HTMLElement = fixture.nativeElement
  //   const terminalEl = element.querySelector('article')
  //   console.log(terminalEl)

  //   component.flashTerminal()

  //   expect(terminalEl?.classList.contains('flash')).toBeTrue()
  // })

  describe('#parseKey()', () => {
    it('"Shift" key', () => {
      const event = new KeyboardEvent('keydown', { key: 'Shift' })

      spyOn(component, 'handleBackspace')
      spyOn(component, 'handleKey')

      component.parseKey(event)

      expect(component.handleBackspace).not.toHaveBeenCalled()
      expect(component.handleKey).not.toHaveBeenCalled()
    })

    it('"F12" key', () => {
      const event = new KeyboardEvent('keydown', { key: 'F12' })

      spyOn(component, 'handleBackspace')
      spyOn(component, 'handleKey')

      component.parseKey(event)

      expect(component.handleBackspace).not.toHaveBeenCalled()
      expect(component.handleKey).not.toHaveBeenCalled()
    })

    it('"Backspace" key', () => {
      const event = new KeyboardEvent('keydown', { key: 'Backspace' })

      spyOn(component, 'handleBackspace')

      component.parseKey(event)

      expect(component.handleBackspace).toHaveBeenCalled()
    })

    it('should parse the given key emitted by the Keyoard and highlight the next key in the queue', () => {
      const expectedKey = defaultText.charAt(0)
      const event = new KeyboardEvent('keydown', { key: expectedKey })

      // component.queue = expectedKey
      spyOn(component, 'handleKey')
      component.parseKey(event)

      expect(component.handleKey).toHaveBeenCalled()
      expect(keyboardSpy.setHighlightKey).toHaveBeenCalledWith(
        component.queue.charAt(0)
      )
    })
  })

  describe('#handleKey()', () => {
    it('should handle an incorrect key by incrementing the error count', () => {
      const key = defaultText.charAt(0)

      spyOn(component, 'flashTerminal')

      component.handleKey(key.toUpperCase())

      expect(component.flashTerminal).toHaveBeenCalled()
      expect(sessionSpy.incrementErrorCount).toHaveBeenCalled()
    })

    it('should handle a correct key by incrementing the character count', () => {
      const key = defaultText.charAt(0)

      component.handleKey(key)

      expect(sessionSpy.incrementCharacterCount).toHaveBeenCalled()
    })

    it('should handle a correct key by incrementing the word count', () => {
      const text = 'a o'
      const key = text.charAt(0)
      component.queue = text
      fixture.detectChanges()

      component.handleKey(key)

      expect(sessionSpy.incrementWordCount).toHaveBeenCalled()
    })
  })

  describe('#handleBackspace()', () => {
    it('should return immediately when there is no text in the stack', () => {
      component.handleBackspace()
      expect(sessionSpy.incrementWordCount).not.toHaveBeenCalled()
      expect(sessionSpy.incrementCharacterCount).not.toHaveBeenCalled()
    })

    it('should decrement the word count', () => {
      // text = hello world
      component.stack = 'hello'
      component.queue = ' world'

      fixture.detectChanges()

      component.handleBackspace()

      expect(sessionSpy.incrementWordCount).toHaveBeenCalledWith(-1)
    })

    it('should decrement the character count', () => {
      // text = hello world
      component.stack = 'h'
      component.queue = 'ello world'

      fixture.detectChanges()

      component.handleBackspace()

      expect(sessionSpy.incrementCharacterCount).toHaveBeenCalledWith(-1)
    })
  })
})
