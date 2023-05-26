import { TestBed } from '@angular/core/testing'
import { SessionService } from './session.service'

describe('SessionService', () => {
  let session: SessionService

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SessionService],
    })
    session = TestBed.inject(SessionService)
  })

  it('should be created', () => {
    expect(session).toBeTruthy()
  })
})
