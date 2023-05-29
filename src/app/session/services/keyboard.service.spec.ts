import { TestBed } from '@angular/core/testing'

import { KeyboardService } from './keyboard.service'

describe('KeyboardService', () => {
  let service: KeyboardService

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KeyboardService],
    })
    service = TestBed.inject(KeyboardService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should set the key pressed', (done: DoneFn) => {
    const subscription = service.keyPressed$.subscribe((key) => {
      expect(key).toEqual('a')
      done()
    })

    service.setKeyPressed('a')
    subscription.unsubscribe()
  })
})
