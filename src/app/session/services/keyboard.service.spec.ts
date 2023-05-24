import { TestBed } from '@angular/core/testing'

import { KeyboardService } from './keyboard.service'

describe('KeyboardService', () => {
  let service: KeyboardService
  const mockEvent = new KeyboardEvent('keydown', {
    key: 'a',
  })

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KeyboardService],
    })
    service = TestBed.inject(KeyboardService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
