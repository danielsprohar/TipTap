import { ParamMap, Params } from "@angular/router";
import { Finger } from "../enums/finger.enum";
import { Hand } from "../enums/hand.enum";
import { Level } from "../enums/level.enum";

export class Lesson {
  level!: Level;
  hand!: Hand;
  finger: Finger = Finger.ALL;
  isHomeKeys: boolean = false;

  constructor(props?: {
    level: Level;
    hand: Hand;
    finger?: Finger;
    isHomeKeys?: boolean;
  }) {
    if (props) {
      this.level = props.level;
      this.hand = props.hand;
      this.finger = props.finger || Finger.ALL;
      this.isHomeKeys = props.isHomeKeys || false;
    }
  }

  get isBothHands() {
    return this.hand === "both";
  }

  toQueryParams(): Params {
    const params: Params = {};

    for (const [key, value] of Object.entries(this)) {
      params[key as keyof Params] = value;
    }

    return params;
  }

  static builder(): LessonBuilder {
    return new LessonBuilder();
  }
}

class LessonBuilder {
  private level?: Level;
  private hand?: Hand;
  private finger?: Finger;
  private _isHomeKeys?: boolean;

  constructor() {}

  setLevel(level: Level): LessonBuilder {
    this.level = level;
    return this;
  }

  setHand(hand: Hand): LessonBuilder {
    this.hand = hand;
    return this;
  }

  setFinger(finger: Finger): LessonBuilder {
    this.finger = finger;
    return this;
  }

  isHomeKeys(isHomeKeys: boolean): LessonBuilder {
    this._isHomeKeys = isHomeKeys;
    return this;
  }

  buildFromParamMap(paramMap: ParamMap): Lesson {
    const obj: any = {};
    for (const key of paramMap.keys) {
      obj[key] = paramMap.get(key);
    }

    return new Lesson({ ...obj });
  }

  build(): Lesson {
    if (this.level === undefined) {
      throw new Error("Level is not set");
    }
    if (this.hand === undefined) {
      throw new Error("Hand is not set");
    }

    return new Lesson({
      level: this.level,
      hand: this.hand,
      finger: this.finger,
      isHomeKeys: this._isHomeKeys,
    });
  }
}
