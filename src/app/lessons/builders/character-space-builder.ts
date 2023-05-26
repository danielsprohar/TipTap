import Keyboard from '../../../assets/keyboard-keys.json'
import { Finger, Hand, Lesson } from '../models/lesson'

export class CharacterSpaceBuilder {
  private lesson: Lesson

  constructor(lesson: Lesson) {
    this.lesson = lesson
  }

  buildHomeKeys(hand: Hand, finger: Finger): string[] {
    const keys: string[] = []

    if (hand === 'both') {
      switch (finger) {
        case 'pinky':
          keys.push(
            ...Keyboard.homeKeys.left.pinky,
            ...Keyboard.homeKeys.right.pinky
          )
          break
        case 'ring':
          keys.push(
            ...Keyboard.homeKeys.left.ring,
            ...Keyboard.homeKeys.right.ring
          )
          break
        case 'middle':
          keys.push(
            ...Keyboard.homeKeys.left.middle,
            ...Keyboard.homeKeys.right.middle
          )
          break
        case 'pointy':
          keys.push(
            ...Keyboard.homeKeys.left.pointy,
            ...Keyboard.homeKeys.right.pointy
          )
          break
        default:
          keys.push(
            ...Keyboard.homeKeys.left.all,
            ...Keyboard.homeKeys.right.all
          )
      }
    } else if (hand === 'left') {
      switch (finger) {
        case 'pinky':
          keys.push(...Keyboard.homeKeys.left.pinky)
          break
        case 'ring':
          keys.push(...Keyboard.homeKeys.left.ring)
          break
        case 'middle':
          keys.push(...Keyboard.homeKeys.left.middle)
          break
        case 'pointy':
          keys.push(...Keyboard.homeKeys.left.pointy)
          break
        default:
          keys.push(...Keyboard.homeKeys.left.all)
      }
    } else {
      // hand = right
      switch (finger) {
        case 'pinky':
          keys.push(...Keyboard.homeKeys.right.pinky)
          break
        case 'ring':
          keys.push(...Keyboard.homeKeys.right.ring)
          break
        case 'middle':
          keys.push(...Keyboard.homeKeys.right.middle)
          break
        case 'pointy':
          keys.push(...Keyboard.homeKeys.right.pointy)
          break
        default:
          keys.push(...Keyboard.homeKeys.right.all)
      }
    }

    return keys
  }

  buildBeginnerKeys(hand: Hand, finger: Finger): string[] {
    const keys: string[] = []

    if (hand === 'both') {
      switch (finger) {
        case 'pinky':
          keys.push(
            ...Keyboard.beginner.left.pinky,
            ...Keyboard.beginner.right.pinky
          )
          break
        case 'ring':
          keys.push(
            ...Keyboard.beginner.left.ring,
            ...Keyboard.beginner.right.ring
          )
          break
        case 'middle':
          keys.push(
            ...Keyboard.beginner.left.middle,
            ...Keyboard.beginner.right.middle
          )
          break
        case 'pointy':
          keys.push(
            ...Keyboard.beginner.left.pointy,
            ...Keyboard.beginner.right.pointy
          )
          break
        default:
          keys.push(
            ...Keyboard.beginner.left.all,
            ...Keyboard.beginner.right.all
          )
      }
    } else if (hand === 'left') {
      switch (finger) {
        case 'pinky':
          keys.push(...Keyboard.beginner.left.pinky)
          break
        case 'ring':
          keys.push(...Keyboard.beginner.left.ring)
          break
        case 'middle':
          keys.push(...Keyboard.beginner.left.middle)
          break
        case 'pointy':
          keys.push(...Keyboard.beginner.left.pointy)
          break
        default:
          keys.push(...Keyboard.beginner.left.all)
      }
    } else {
      // hand = right
      switch (finger) {
        case 'pinky':
          keys.push(...Keyboard.beginner.right.pinky)
          break
        case 'ring':
          keys.push(...Keyboard.beginner.right.ring)
          break
        case 'middle':
          keys.push(...Keyboard.beginner.right.middle)
          break
        case 'pointy':
          keys.push(...Keyboard.beginner.right.pointy)
          break
        default:
          keys.push(...Keyboard.beginner.right.all)
      }
    }

    return keys
  }

  buildIntermediateKeys(hand: Hand, finger: Finger): string[] {
    const keys = this.buildBeginnerKeys(hand, finger)

    if (hand === 'both') {
      switch (finger) {
        case 'pinky':
          keys.push(
            ...Keyboard.intermediate.left.pinky,
            ...Keyboard.intermediate.right.pinky
          )
          break
        case 'ring':
          keys.push(
            ...Keyboard.intermediate.left.ring,
            ...Keyboard.intermediate.right.ring
          )
          break
        case 'middle':
          keys.push(
            ...Keyboard.intermediate.left.middle,
            ...Keyboard.intermediate.right.middle
          )
          break
        case 'pointy':
          keys.push(
            ...Keyboard.intermediate.left.pointy,
            ...Keyboard.intermediate.right.pointy
          )
          break
        default:
          keys.push(
            ...Keyboard.intermediate.left.all,
            ...Keyboard.intermediate.right.all
          )
      }
    } else if (hand === 'left') {
      switch (finger) {
        case 'pinky':
          keys.push(...Keyboard.intermediate.left.pinky)
          break
        case 'ring':
          keys.push(...Keyboard.intermediate.left.ring)
          break
        case 'middle':
          keys.push(...Keyboard.intermediate.left.middle)
          break
        case 'pointy':
          keys.push(...Keyboard.intermediate.left.pointy)
          break
        default:
          keys.push(...Keyboard.intermediate.left.all)
      }
    } else {
      // hand = right
      switch (finger) {
        case 'pinky':
          keys.push(...Keyboard.intermediate.right.pinky)
          break
        case 'ring':
          keys.push(...Keyboard.intermediate.right.ring)
          break
        case 'middle':
          keys.push(...Keyboard.intermediate.right.middle)
          break
        case 'pointy':
          keys.push(...Keyboard.intermediate.right.pointy)
          break
        default:
          keys.push(...Keyboard.intermediate.right.all)
      }
    }

    return keys
  }

  build(): string[] {
    if (this.lesson.isHomeKeys) {
      return this.buildHomeKeys(this.lesson.hand, this.lesson.finger || 'all')
    }

    switch (this.lesson.level) {
      case 'beginner':
        return this.buildBeginnerKeys(
          this.lesson.hand,
          this.lesson.finger || 'all'
        ).sort()
      case 'intermediate':
        return this.buildIntermediateKeys(
          this.lesson.hand,
          this.lesson.finger || 'all'
        ).sort()
      case 'advanced':
        break
      default:
        break
    }

    return []
  }
}
