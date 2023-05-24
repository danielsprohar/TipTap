import { ComponentFixture, TestBed } from '@angular/core/testing'
import { SnackbarService } from 'src/app/services/snackbar.service'
import { SnackbarComponent } from './snackbar.component'

describe('SnackbarComponent', () => {
  let component: SnackbarComponent
  let fixture: ComponentFixture<SnackbarComponent>
  let snackbar: SnackbarService
  let mockMessage: string

  beforeEach(async () => {
    mockMessage = 'hello there'

    await TestBed.configureTestingModule({
    imports: [SnackbarComponent],
}).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(SnackbarComponent)
    snackbar = TestBed.inject(SnackbarService)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should display the message provided by the Snackbar service', (done: DoneFn) => {
    snackbar.open(mockMessage)
    fixture.detectChanges()
    component.message$?.subscribe((message: string) => {
      expect(message).toEqual(mockMessage)
      done()
    })
  })
})
