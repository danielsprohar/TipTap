import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'

import { LessonsComponent } from './lessons.component'

describe('LessonsComponent', () => {
  let component: LessonsComponent
  let fixture: ComponentFixture<LessonsComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [LessonsComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
}).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(LessonsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
