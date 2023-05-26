import { ParamMap, Params } from '@angular/router'
import { Book } from '../../models/book'

export type Level = 'beginner' | 'intermediate' | 'advanced'
export type Hand = 'left' | 'right' | 'both'
export type Finger = 'pointy' | 'middle' | 'ring' | 'pinky' | 'all'

export class Lesson {
  level!: Level
  hand!: Hand
  finger: Finger = 'all'
  isHomeKeys: boolean = false
  book: Book | null = null

  constructor(props?: {
    level: Level
    hand: Hand
    finger?: Finger
    isHomeKeys?: boolean
    book?: Book
  }) {
    if (props) {
      this.level = props.level
      this.hand = props.hand
      this.finger = props.finger || 'all'
      this.isHomeKeys = props.isHomeKeys || false
      this.book = props.book || null
    }
  }

  get isBothHands() {
    return this.hand === 'both'
  }

  toQueryParams(): Params {
    const params: Params = {}

    for (const [key, value] of Object.entries(this)) {
      params[key as keyof Params] = value
    }

    return params
  }

  static builder(): LessonBuilder {
    return new LessonBuilder()
  }
}

class LessonBuilder {
  private level?: Level
  private hand?: Hand
  private finger?: Finger
  private book?: Book
  private _isHomeKeys?: boolean

  constructor() {}

  setBook(book: Book): LessonBuilder {
    this.book = book
    this.level = 'advanced'
    this.hand = 'both'
    return this
  }

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
    const obj: any = {}
    for (const key of paramMap.keys) {
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
    if (this.level === undefined) {
      throw new Error('Level is not set')
    }
    if (this.hand === undefined) {
      throw new Error('Hand is not set')
    }

    return new Lesson({
      level: this.level,
      hand: this.hand,
      finger: this.finger,
      isHomeKeys: this._isHomeKeys,
      book: this.book,
    })
  }
}
