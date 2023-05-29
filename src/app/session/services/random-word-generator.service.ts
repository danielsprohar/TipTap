import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'
import { CharacterSpace } from '../../lessons/character-space'

@Injectable({
  providedIn: 'root',
})
export class RandomWordGeneratorService {
  private readonly defaultWordCount = environment.rwg.defaults.wordCount
  private readonly defaultWordSize = environment.rwg.defaults.wordSize

  /**
   * Creates a random word from the given character space.
   *
   * Word in this context is defined to be a sequence of random characters of size n
   * from the provided character space. Note, that only a subset of characters MAY be
   * in the creation of a word.
   * In other words, it is NOT necessary that every element in the set be present in the word that is generated.
   *
   * @param characterSpace The character space.
   * @param n The length of the character sequence.
   * @returns A random sequence of characters.
   */
  createRandomWord(
    characterSpace: CharacterSpace,
    n: number = this.defaultWordSize
  ): string {
    const max = characterSpace.size
    const characterSpaceArray: string[] = Array.from(characterSpace)
    const characters: string[] = []

    // indices
    let i = 0
    let j = 0

    while (i < n) {
      // Randomly select an index in the range [0, n-1]
      j = Math.floor(Math.random() * max)
      // Get a character from the character space
      characters.push(characterSpaceArray[j])
      i++
    }

    return characters.join('')
  }

  /**
   * Creates a word list of a given size from a given character space.
   * A character space is a set of characters.
   * For example, ["a", "b", "c"]
   *
   * @param characterSpace The character space to use when generating the word list.
   * @param wordCount The number of words to generate.
   * @param wordSize The number of characters in each word.
   * @returns A word list with random words.
   */
  createRandomWords(
    characterSpace: CharacterSpace,
    wordCount: number = this.defaultWordCount,
    wordSize: number = this.defaultWordSize
  ): string[] {
    const words: string[] = []

    for (let i = 0; i < wordCount; i++) {
      words.push(this.createRandomWord(characterSpace, wordSize))
    }

    return words
  }
}
