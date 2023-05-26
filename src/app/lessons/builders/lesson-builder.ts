import { ParamMap } from '@angular/router'
import { Book } from '../../models/book'
import { Finger, Hand, Lesson, Level } from '../models/lesson'

export class LessonBuilder {
  private level?: Level
  private hand?: Hand
  private finger?: Finger
  private book?: Book
  private _isHomeKeys?: boolean

  constructor() {}

  setLevel(level: Level): LessonBuilder {
    this.level = level
    return this
  }

  setHand(hand: Hand): LessonBuilder {
    this.hand = hand
    return this
  }

  setFinger(finger: Finger): LessonBuilder {
    this.finger = finger
    return this
  }

  isHomeKeys(isHomeKeys: boolean): LessonBuilder {
    this._isHomeKeys = isHomeKeys
    return this
  }

  buildFromParamMap(paramMap: ParamMap): Lesson {
    let obj: any = {}
    for (let key of paramMap.keys) {
      obj[key] = paramMap.get(key)
    }

    if (obj.book) {
      return new Lesson({
        ...obj,
        book: new Book({
          title: obj.book,
          chapter: obj.chapter,
        }),
      })
    }

    return new Lesson({ ...obj })
  }

  build(): Lesson {
    return new Lesson({
      level: this.book ? 'advanced' : this.level!,
      hand: this.book ? 'both' : this.hand!,
      finger: this.finger,
      isHomeKeys: this._isHomeKeys,
      book: this.book,
    })
  }
}
