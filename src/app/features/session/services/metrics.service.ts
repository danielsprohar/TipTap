import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { SessionSample } from "../models/time-series-sample";
import { MathUtil } from "../utils/math-util";

@Injectable()
export class MetricsService {
  private _characterCount = 0;
  private _wordCount = 0;
  private _totalErrors = 0;
  private _wordsAttemptedCount = 0;
  private _wordsWithErrorsCount = 0;
  private _errorsBetweenSamples = 0;

  private readonly _samples: SessionSample[] = [];
  readonly timeSeries$: Observable<SessionSample[]> = of(this._samples);

  getTotalCharacters() {
    return this._characterCount;
  }

  getTotalWords() {
    return this._wordCount;
  }

  getTotalErrors() {
    return this._totalErrors;
  }

  getTotalWordsWithErrors() {
    return this._wordsWithErrorsCount;
  }

  getTotalWordsAttempted() {
    return this._wordsAttemptedCount;
  }

  getAccuracy() {
    return MathUtil.calculateAccuracy(this._characterCount, this._totalErrors);
  }

  setWordsAttemptedCount(value: number) {
    this._wordsAttemptedCount = value;
  }

  setWordsErrorCount(value: number) {
    this._wordsWithErrorsCount = value;
  }

  sample(timeSeconds: number, wordSize: number) {
    let cpm = 0;
    let rawWPM = 0;
    let netWPM = 0;

    if (timeSeconds > 0) {
      cpm = MathUtil.calulateCPM(this._characterCount, timeSeconds);
      rawWPM = MathUtil.calculateRawWPMFromCPM(cpm);
      netWPM = MathUtil.calculateNetWPMFromRawWPM(
        rawWPM,
        this._totalErrors,
        timeSeconds
      );
    }

    const sample: SessionSample = {
      timeSeconds,
      errors: this._errorsBetweenSamples,
      cpm,
      rawWPM,
      netWPM,
    };

    this._samples.push(sample);
    this._errorsBetweenSamples = 0;
  }

  decrementWordCount() {
    this._wordCount--;
  }

  decrementCharacterCount() {
    this._characterCount--;
  }

  decrementErrorCount() {
    this._totalErrors--;
    this._errorsBetweenSamples--;
  }

  incrementCharacterCount() {
    this._characterCount++;
  }

  incrementWordCount() {
    this._wordCount++;
  }

  incrementErrorCount() {
    this._totalErrors++;
    this._errorsBetweenSamples++;
  }

  reset() {
    this._samples.length = 0;
    this._characterCount = 0;
    this._wordCount = 0;
    this._totalErrors = 0;
  }
}
