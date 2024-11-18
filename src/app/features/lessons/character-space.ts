import { Keys } from "../../constants/keys";
import { Finger } from "../../enums/finger.enum";
import { Hand } from "../../enums/hand.enum";
import { Level } from "../../enums/level.enum";
import { Lesson } from "../../models/lesson";

export class CharacterSpace extends Set<string> {
  static fromLesson(lesson: Lesson): CharacterSpace {
    return CharacterSpace.builder().lesson(lesson).build();
  }

  static builder(): CharacterSpaceBuilder {
    return new CharacterSpaceBuilder();
  }
}

class CharacterSpaceBuilder {
  private _level: Level = Level.BEGINNER;
  private _isHomeKeys: boolean = false;
  private _hand?: Hand;
  private _finger?: Finger;

  lesson(lesson: Lesson): CharacterSpaceBuilder {
    this._level = lesson.level;
    this._hand = lesson.hand;
    this._finger = lesson.finger;
    this._isHomeKeys = lesson.isHomeKeys;
    return this;
  }

  level(level: Level): CharacterSpaceBuilder {
    this._level = level;
    return this;
  }

  hand(hand: Hand): CharacterSpaceBuilder {
    this._hand = hand;
    return this;
  }

  finger(finger: Finger): CharacterSpaceBuilder {
    this._finger = finger;
    return this;
  }

  isHomeKeys(isHomeKeys: boolean): CharacterSpaceBuilder {
    this._isHomeKeys = isHomeKeys;
    return this;
  }

  private buildHomeKeys(hand: Hand, finger: Finger): string[] {
    const keys: string[] = [];

    if (hand === Hand.BOTH) {
      switch (finger) {
        case Finger.PINKY:
          keys.push(...Keys.homeKeys.left.pinky, ...Keys.homeKeys.right.pinky);
          break;
        case Finger.RING:
          keys.push(...Keys.homeKeys.left.ring, ...Keys.homeKeys.right.ring);
          break;
        case Finger.MIDDLE:
          keys.push(
            ...Keys.homeKeys.left.middle,
            ...Keys.homeKeys.right.middle
          );
          break;
        case Finger.POINTY:
          keys.push(
            ...Keys.homeKeys.left.pointy,
            ...Keys.homeKeys.right.pointy
          );
          break;
        default:
          keys.push(...Keys.homeKeys.left.all, ...Keys.homeKeys.right.all);
      }
    } else if (hand === Hand.LEFT) {
      switch (finger) {
        case Finger.PINKY:
          keys.push(...Keys.homeKeys.left.pinky);
          break;
        case Finger.RING:
          keys.push(...Keys.homeKeys.left.ring);
          break;
        case Finger.MIDDLE:
          keys.push(...Keys.homeKeys.left.middle);
          break;
        case Finger.POINTY:
          keys.push(...Keys.homeKeys.left.pointy);
          break;
        default:
          keys.push(...Keys.homeKeys.left.all);
      }
    } else {
      // hand = right
      switch (finger) {
        case Finger.PINKY:
          keys.push(...Keys.homeKeys.right.pinky);
          break;
        case Finger.RING:
          keys.push(...Keys.homeKeys.right.ring);
          break;
        case Finger.MIDDLE:
          keys.push(...Keys.homeKeys.right.middle);
          break;
        case Finger.POINTY:
          keys.push(...Keys.homeKeys.right.pointy);
          break;
        default:
          keys.push(...Keys.homeKeys.right.all);
      }
    }

    return keys;
  }

  private buildBeginnerKeys(hand: Hand, finger: Finger): string[] {
    const keys: string[] = [];

    if (hand === Hand.BOTH) {
      switch (finger) {
        case Finger.PINKY:
          keys.push(...Keys.beginner.left.pinky, ...Keys.beginner.right.pinky);
          break;
        case Finger.RING:
          keys.push(...Keys.beginner.left.ring, ...Keys.beginner.right.ring);
          break;
        case Finger.MIDDLE:
          keys.push(
            ...Keys.beginner.left.middle,
            ...Keys.beginner.right.middle
          );
          break;
        case Finger.POINTY:
          keys.push(
            ...Keys.beginner.left.pointy,
            ...Keys.beginner.right.pointy
          );
          break;
        default:
          keys.push(...Keys.beginner.left.all, ...Keys.beginner.right.all);
      }
    } else if (hand === Hand.LEFT) {
      switch (finger) {
        case Finger.PINKY:
          keys.push(...Keys.beginner.left.pinky);
          break;
        case Finger.RING:
          keys.push(...Keys.beginner.left.ring);
          break;
        case Finger.MIDDLE:
          keys.push(...Keys.beginner.left.middle);
          break;
        case Finger.POINTY:
          keys.push(...Keys.beginner.left.pointy);
          break;
        default:
          keys.push(...Keys.beginner.left.all);
      }
    } else {
      // hand = right
      switch (finger) {
        case Finger.PINKY:
          keys.push(...Keys.beginner.right.pinky);
          break;
        case Finger.RING:
          keys.push(...Keys.beginner.right.ring);
          break;
        case Finger.MIDDLE:
          keys.push(...Keys.beginner.right.middle);
          break;
        case Finger.POINTY:
          keys.push(...Keys.beginner.right.pointy);
          break;
        default:
          keys.push(...Keys.beginner.right.all);
      }
    }

    return keys;
  }

  private buildIntermediateKeys(hand: Hand, finger: Finger): string[] {
    const keys = this.buildBeginnerKeys(hand, finger);
    if (hand === Hand.BOTH) {
      switch (finger) {
        case Finger.PINKY:
          keys.push(
            ...Keys.intermediate.left.pinky,
            ...Keys.intermediate.right.pinky
          );
          break;
        case Finger.RING:
          keys.push(
            ...Keys.intermediate.left.ring,
            ...Keys.intermediate.right.ring
          );
          break;
        case Finger.MIDDLE:
          keys.push(
            ...Keys.intermediate.left.middle,
            ...Keys.intermediate.right.middle
          );
          break;
        case Finger.POINTY:
          keys.push(
            ...Keys.intermediate.left.pointy,
            ...Keys.intermediate.right.pointy
          );
          break;
        default:
          keys.push(
            ...Keys.intermediate.left.all,
            ...Keys.intermediate.right.all
          );
      }
    } else if (hand === Hand.LEFT) {
      switch (finger) {
        case Finger.PINKY:
          keys.push(...Keys.intermediate.left.pinky);
          break;
        case Finger.RING:
          keys.push(...Keys.intermediate.left.ring);
          break;
        case Finger.MIDDLE:
          keys.push(...Keys.intermediate.left.middle);
          break;
        case Finger.POINTY:
          keys.push(...Keys.intermediate.left.pointy);
          break;
        default:
          keys.push(...Keys.intermediate.left.all);
      }
    } else {
      // hand = right
      switch (finger) {
        case Finger.PINKY:
          keys.push(...Keys.intermediate.right.pinky);
          break;
        case Finger.RING:
          keys.push(...Keys.intermediate.right.ring);
          break;
        case Finger.MIDDLE:
          keys.push(...Keys.intermediate.right.middle);
          break;
        case Finger.POINTY:
          keys.push(...Keys.intermediate.right.pointy);
          break;
        default:
          keys.push(...Keys.intermediate.right.all);
      }
    }

    return keys;
  }

  build(): CharacterSpace {
    if (this._hand === undefined) {
      throw new Error("Hand is undefined");
    }
    if (this._finger === undefined) {
      throw new Error("Finger is undefined");
    }

    if (this._isHomeKeys) {
      return new CharacterSpace(this.buildHomeKeys(this._hand, this._finger));
    }

    switch (this._level) {
      case Level.BEGINNER:
        return new CharacterSpace(
          this.buildBeginnerKeys(this._hand, this._finger)
        );
      case Level.INTERMEDIATE:
        return new CharacterSpace(
          this.buildIntermediateKeys(this._hand, this._finger)
        );
      default:
        return new CharacterSpace();
    }
  }
}
