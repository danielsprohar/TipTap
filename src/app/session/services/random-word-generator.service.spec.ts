import { TestBed } from "@angular/core/testing";
import { environment } from "src/environments/environment";
import { CharacterSpace } from "../../lessons/character-space";
import { RandomWordGeneratorService } from "./random-word-generator.service";

function isSuperset(set: CharacterSpace, subset: CharacterSpace) {
  for (const elem of subset) {
    if (!set.has(elem)) {
      return false;
    }
  }
  return true;
}

describe("RandomWordGeneratorService", () => {
  let service: RandomWordGeneratorService;
  const characterSpace = new CharacterSpace(["a", "b", "c"]);
  const wordSize = environment.rwg.defaults.wordSize;
  const wordCount = environment.rwg.defaults.wordCount;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RandomWordGeneratorService],
    });

    service = TestBed.inject(RandomWordGeneratorService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("#createRandomWord() should create a random word", () => {
    const word: string = service.createRandomWord(characterSpace, wordSize);

    expect(word.length).toBe(wordSize);
    expect(
      isSuperset(characterSpace, new CharacterSpace(word.split("")))
    ).toBeTrue();
  });

  it("#createRandomWords() should create random words", () => {
    const words = service
      .createRandomWords(characterSpace, wordCount)
      .filter((word) => word !== " ");

    expect(words.length).toBe(wordCount);

    words.forEach((word: string) => {
      expect(word.length).toBe(wordSize);
    });
  });

  it("#createSessionText() should create the session text", () => {
    const words: string[] = service.createRandomWords(
      characterSpace,
      wordCount,
      wordSize
    );
    expect(words.length).toBe(wordCount);
  });
});
