import { LayoutModule } from '@angular/cdk/layout'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatToolbarModule } from '@angular/material/toolbar'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { RouterTestingModule } from '@angular/router/testing'
import { AuthService } from '@auth0/auth0-angular'
import { AppComponent } from './app.component'

describe('AppComponent', () => {
  let component: AppComponent
  let fixture: ComponentFixture<AppComponent>
  let authSpy: jasmine.SpyObj<AuthService>

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj(
      'AuthService',
      ['loginWithRedirect', 'logout'],
      ['user$']
    )

    await TestBed.configureTestingModule({
    imports: [
        RouterTestingModule,
        NoopAnimationsModule,
        LayoutModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatSidenavModule,
        MatToolbarModule,
        AppComponent,
    ],
    providers: [
        {
            provide: AuthService,
            useValue: authSpy,
        },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
}).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should compile', () => {
    expect(component).toBeTruthy()
  })
})
