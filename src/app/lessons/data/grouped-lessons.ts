import { Finger, Hand, Level } from '../../enums'
import { Lesson } from '../../models/lesson'

// Beginner lessons
const beginnerLessonsGroupedByHand = new Map<Hand, Lesson[]>()
beginnerLessonsGroupedByHand.set(Hand.LEFT, [
  new Lesson({
    level: Level.BEGINNER,
    hand: Hand.LEFT,
    finger: Finger.PINKY,
    isHomeKeys: false,
  }),
  new Lesson({
    level: Level.BEGINNER,
    hand: Hand.LEFT,
    finger: Finger.RING,
    isHomeKeys: false,
  }),
  new Lesson({
    level: Level.BEGINNER,
    hand: Hand.LEFT,
    finger: Finger.MIDDLE,
    isHomeKeys: false,
  }),
  new Lesson({
    level: Level.BEGINNER,
    hand: Hand.LEFT,
    finger: Finger.POINTY,
    isHomeKeys: false,
  }),
])

beginnerLessonsGroupedByHand.set(Hand.RIGHT, [
  new Lesson({
    level: Level.BEGINNER,
    hand: Hand.RIGHT,
    finger: Finger.PINKY,
    isHomeKeys: false,
  }),
  new Lesson({
    level: Level.BEGINNER,
    hand: Hand.RIGHT,
    finger: Finger.RING,
    isHomeKeys: false,
  }),
  new Lesson({
    level: Level.BEGINNER,
    hand: Hand.RIGHT,
    finger: Finger.MIDDLE,
    isHomeKeys: false,
  }),
  new Lesson({
    level: Level.BEGINNER,
    hand: Hand.RIGHT,
    finger: Finger.POINTY,
    isHomeKeys: false,
  }),
])

beginnerLessonsGroupedByHand.set(Hand.BOTH, [
  new Lesson({
    level: Level.BEGINNER,
    hand: Hand.LEFT,
    finger: Finger.ALL,
    isHomeKeys: true,
  }),
  new Lesson({
    level: Level.BEGINNER,
    hand: Hand.RIGHT,
    finger: Finger.ALL,
    isHomeKeys: true,
  }),
  new Lesson({
    level: Level.BEGINNER,
    hand: Hand.BOTH,
    finger: Finger.ALL,
    isHomeKeys: true,
  }),
])

// Intermediate lessons
const intermediateLessonsGroupedByHand = new Map<Hand, Lesson[]>()
intermediateLessonsGroupedByHand.set(Hand.LEFT, [
  new Lesson({
    level: Level.INTERMEDIATE,
    hand: Hand.LEFT,
    finger: Finger.PINKY,
    isHomeKeys: false,
  }),
  new Lesson({
    level: Level.INTERMEDIATE,
    hand: Hand.LEFT,
    finger: Finger.RING,
    isHomeKeys: false,
  }),
  new Lesson({
    level: Level.INTERMEDIATE,
    hand: Hand.LEFT,
    finger: Finger.MIDDLE,
    isHomeKeys: false,
  }),
  new Lesson({
    level: Level.INTERMEDIATE,
    hand: Hand.LEFT,
    finger: Finger.POINTY,
    isHomeKeys: false,
  }),
])

intermediateLessonsGroupedByHand.set(Hand.RIGHT, [
  new Lesson({
    level: Level.INTERMEDIATE,
    hand: Hand.RIGHT,
    finger: Finger.PINKY,
    isHomeKeys: false,
  }),
  new Lesson({
    level: Level.INTERMEDIATE,
    hand: Hand.RIGHT,
    finger: Finger.RING,
    isHomeKeys: false,
  }),
  new Lesson({
    level: Level.INTERMEDIATE,
    hand: Hand.RIGHT,
    finger: Finger.MIDDLE,
    isHomeKeys: false,
  }),
  new Lesson({
    level: Level.INTERMEDIATE,
    hand: Hand.RIGHT,
    finger: Finger.POINTY,
    isHomeKeys: false,
  }),
])

intermediateLessonsGroupedByHand.set(Hand.BOTH, [
  new Lesson({
    level: Level.INTERMEDIATE,
    hand: Hand.BOTH,
    finger: Finger.ALL,
    isHomeKeys: false,
  }),
])

export const map = new Map<Level, Map<Hand, Lesson[]>>()
map.set(Level.BEGINNER, beginnerLessonsGroupedByHand)
map.set(Level.INTERMEDIATE, intermediateLessonsGroupedByHand)
map.set = function () {
  throw new Error('Cannot set value on this map')
}

export const lessonsGroupedByLevelThenHand = Object.freeze(map)
