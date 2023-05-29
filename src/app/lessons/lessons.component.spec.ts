import { ComponentFixture, TestBed } from '@angular/core/testing'

import { importProvidersFrom } from '@angular/core'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { RouterModule } from '@angular/router'
import {
  RouterTestingHarness,
  RouterTestingModule,
} from '@angular/router/testing'
import { LessonsComponent } from './lessons.component'

describe('LessonsComponent', () => {
  let component: LessonsComponent
  let fixture: ComponentFixture<LessonsComponent>
  let harness: RouterTestingHarness

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LessonsComponent,
        NoopAnimationsModule,
        RouterTestingModule.withRoutes([]),
      ],
      providers: [importProvidersFrom(RouterModule)],
    }).compileComponents()

    harness = await RouterTestingHarness.create()
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
