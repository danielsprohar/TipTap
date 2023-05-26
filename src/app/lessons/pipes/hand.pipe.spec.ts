import { Hand } from '../../enums'
import { HandPipe } from './hand.pipe'

describe('HandPipe', () => {
  it('create an instance', () => {
    const pipe = new HandPipe()
    expect(pipe).toBeTruthy()
  })

  it('should return "Left Hand" when Hand.LEFT is passed in', () => {
    const pipe = new HandPipe()
    expect(pipe.transform(Hand.LEFT)).toBe('Left Hand')
  })

  it('should return "Right Hand" when Hand.RIGHT is passed in', () => {
    const pipe = new HandPipe()
    expect(pipe.transform(Hand.RIGHT)).toBe('Right Hand')
  })

  it('should return "Both Hands" when Hand.BOTH is passed in', () => {
    const pipe = new HandPipe()
    expect(pipe.transform(Hand.BOTH)).toBe('Both Hands')
  })
})
