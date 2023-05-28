import { ComponentFixture, TestBed } from '@angular/core/testing'

import { Lesson } from '../../../models'
import { SessionResults } from '../../models/session-results'
import { MetricsTableComponent } from './metrics-table.component'
import { DecimalPipe, PercentPipe } from '@angular/common'

describe('MetricsTableComponent', () => {
  let component: MetricsTableComponent
  let fixture: ComponentFixture<MetricsTableComponent>
  const sessionResults: SessionResults = SessionResults.builder()
    .lesson({} as Lesson)
    .errors(2)
    .totalCharacters(25)
    .totalWords(5)
    .totalWordsWithErrors(2)
    .accuracy(0.5)
    .durationSeconds(30)
    .startedAt(new Date())
    .completedAt(new Date())
    .build()

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MetricsTableComponent],
    })
    fixture = TestBed.createComponent(MetricsTableComponent)
    component = fixture.componentInstance
    component.sessionResults = sessionResults
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should render the metrics table', () => {
    const compiled: Element = fixture.nativeElement
    const cells: NodeListOf<Element> = compiled.querySelectorAll('mat-cell')
    expect(cells.length).toBeGreaterThan(0)

    const {
      accuracy,
      rawWPM,
      netWPM,
      totalWords,
      totalWordsWithErrors,
      totalCharacters,
    } = component.sessionResults

    const accuracyCell: Element = cells[0]
    const expectedAccuracy = new PercentPipe('en-US').transform(accuracy)
    expect(accuracyCell.textContent)
      .withContext('accuracy')
      .toContain(expectedAccuracy)

    const rawWPMCell: Element = cells[1]
    const expectedRawWPM = new DecimalPipe('en-US').transform(rawWPM, '1.0-2')
    expect(rawWPMCell.textContent)
      .withContext('rawWPM')
      .toContain(expectedRawWPM)

    const netWPMCell: Element = cells[2]
    const expectedNetWPM = new DecimalPipe('en-US').transform(netWPM, '1.0-2')
    expect(netWPMCell.textContent)
      .withContext('netWPM')
      .toContain(expectedNetWPM)

    const totalWordsCell: Element = cells[3]
    expect(totalWordsCell.textContent)
      .withContext('totalWords')
      .toContain(`${totalWords}`)

    const totalWordsWithErrorsCell: Element = cells[4]
    expect(totalWordsWithErrorsCell.textContent)
      .withContext('totalWordsWithErrors')
      .toContain(`${totalWordsWithErrors}`)

    const totalCharactersCell: Element = cells[5]
    expect(totalCharactersCell.textContent)
      .withContext('totalCharacters')
      .toContain(`${totalCharacters}`)
  })
})
