import { Constants } from "../../../constants/constants";

/**
 * @see https://www.speedtypingonline.com/typing-equations
 */
export class MathUtil {
  static calculateAccuracy(
    totalCharacters: number,
    totalErrors: number
  ): number {
    if (totalCharacters === 0) {
      return 0;
    }

    return 1 - totalErrors / totalCharacters;
  }

  /**
   * Calculates how many characters you can type in a minute
   * @param totalCharacters
   * @param timeSeconds
   * @returns
   */
  static calulateCPM(totalCharacters: number, timeSeconds: number): number {
    const mins = timeSeconds / 60;
    return totalCharacters / mins;
  }

  /**
   * Calculates how fast you can type without accounting for your mistakes
   * @param totalCharacters
   * @param timeSeconds
   * @param wordSize
   * @returns
   */
  static calculateRawWPM(totalCharacters: number, timeSeconds: number): number {
    return this.calulateCPM(totalCharacters, timeSeconds) / Constants.WORD_SIZE;
  }

  static calculateRawWPMFromCPM(cpm: number): number {
    return cpm / Constants.WORD_SIZE;
  }

  /**
   * Calculates how fast you can type while accounting for your mistakes
   * @param totalCharacters
   * @param totalErrors
   * @param wordSize
   * @param timeSeconds
   * @returns
   */
  static calculateNetWPM(
    totalCharacters: number,
    totalErrors: number,
    timeSeconds: number
  ): number {
    const raw = this.calculateRawWPM(totalCharacters, timeSeconds);
    const mins = timeSeconds / 60;
    const errorRate = totalErrors / mins;
    return raw - errorRate;
  }

  static calculateNetWPMFromRawWPM(
    rawWPM: number,
    totalErrors: number,
    timeSeconds: number
  ): number {
    const mins = timeSeconds / 60;
    const errorRate = totalErrors / mins;
    return rawWPM - errorRate;
  }
}
