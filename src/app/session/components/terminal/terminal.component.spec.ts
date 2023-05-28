import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TerminalComponent } from './terminal.component'

describe('TerminalComponent', () => {
  let component: TerminalComponent
  let fixture: ComponentFixture<TerminalComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerminalComponent],
      providers: [],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })
})
