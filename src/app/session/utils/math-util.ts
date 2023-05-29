/**
 * @see https://www.speedtypingonline.com/typing-equations
 */
export class MathUtil {
  static calculateAccuracy(
    totalCharacters: number,
    totalErrors: number
  ): number {
    return totalCharacters > 0
      ? (totalCharacters - totalErrors) / totalCharacters
      : 0
  }

  /**
   * Calculates how many characters you can type in a minute
   * @param totalCharacters
   * @param timeSeconds
   * @returns
   */
  static calulateCPM(totalCharacters: number, timeSeconds: number): number {
    return (totalCharacters / timeSeconds) * 60
  }

  /**
   * Calculates how fast you can type without accounting for your mistakes
   * @param totalCharacters
   * @param timeSeconds
   * @param wordSize
   * @returns
   */
  static calculateRawWPM(
    totalCharacters: number,
    wordSize: number,
    timeSeconds: number
  ): number {
    return this.calulateCPM(totalCharacters, timeSeconds) / wordSize
  }

  static calculateRawWPMFromCPM(cpm: number, wordSize: number): number {
    return cpm / wordSize
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
    wordSize: number,
    timeSeconds: number
  ): number {
    const raw = this.calculateRawWPM(totalCharacters, wordSize, timeSeconds)
    const mins = timeSeconds / 60
    const errorRate = totalErrors / mins
    return raw - errorRate
  }

  static calculateNetWPMFromRawWPM(
    rawWPM: number,
    totalErrors: number,
    timeSeconds: number
  ): number {
    const mins = timeSeconds / 60
    const errorRate = totalErrors / mins
    return rawWPM - errorRate
  }
}
