import { ResolveFn } from "@angular/router";
import dataSource from "../../../../assets/data/word-data.json";

export const randomLessonResolver: ResolveFn<string[]> = () => {
  const data: string[][] = dataSource;
  const randomIndex = Math.floor(Math.random() * data.length);
  const randomElement = data[randomIndex];
  return randomElement
    .map((phrase) => phrase.split(" "))
    .flatMap((words) => words);
};
