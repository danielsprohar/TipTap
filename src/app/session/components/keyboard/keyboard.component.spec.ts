import { ComponentFixture, TestBed } from '@angular/core/testing'
import { KeyboardService } from '../services/keyboard.service'

import { KeyboardComponent } from './keyboard.component'

describe('KeyboardComponent', () => {
  let component: KeyboardComponent
  let fixture: ComponentFixture<KeyboardComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [KeyboardComponent],
    providers: [KeyboardService],
}).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyboardComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
