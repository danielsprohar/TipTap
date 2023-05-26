import { LayoutModule } from '@angular/cdk/layout'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatListModule } from '@angular/material/list'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatToolbarModule } from '@angular/material/toolbar'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { RouterTestingModule } from '@angular/router/testing'
import { of } from 'rxjs'
import { AppComponent } from './app.component'
import { HandsetService } from './services/handset.service'
import { ThemeService } from './services/theme.service'


describe('AppComponent', () => {
  let component: AppComponent
  let fixture: ComponentFixture<AppComponent>
  let themeService: jasmine.SpyObj<ThemeService>
  let handsetService: jasmine.SpyObj<HandsetService>

  beforeEach(async () => {
    themeService = jasmine.createSpyObj<ThemeService>(
      'ThemeService',
      ['toggle'],
      {
        isDarkTheme$: of(false),
      }
    )

    handsetService = jasmine.createSpyObj<HandsetService>(
      'HandsetService',
      {},
      {
        isHandset$: of(false),
      }
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
        { provide: ThemeService, useValue: themeService },
        { provide: HandsetService, useValue: handsetService },
      ],
    }).compileComponents()
  })

  it('should compile', () => {
    fixture = TestBed.createComponent(AppComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
    expect(component).toBeTruthy()
  })

  describe('#toggleTheme', () => {
    it('should call the theme service to toggle the theme', () => {
      fixture = TestBed.createComponent(AppComponent)
      component = fixture.componentInstance
      fixture.detectChanges()

      const button: HTMLButtonElement = fixture.nativeElement.querySelector(
        '[data-test="toggle-theme"]'
      )
      button.click()

      expect(themeService.toggle).toHaveBeenCalled()
    })
  })

  describe('isHandset$', () => {
    it('should show navigation links in the topnav when not on a handset device', () => {
      fixture = TestBed.createComponent(AppComponent)
      component = fixture.componentInstance
      fixture.detectChanges()

      const topnav: HTMLElement = fixture.nativeElement.querySelector('#topnav')
      expect(topnav).toBeTruthy()

      const links: NodeListOf<HTMLAnchorElement> = topnav.querySelectorAll('a')
      expect(links.length).toBeGreaterThan(1)
    })

    it('should show navigation links in the sidenav when on a handset device', () => {
      TestBed.overrideProvider(HandsetService, {
        useValue: {
          isHandset$: of(true),
        },
      })
      fixture = TestBed.createComponent(AppComponent)
      component = fixture.componentInstance
      fixture.detectChanges()

      const topnav: HTMLElement = fixture.nativeElement.querySelector('#topnav')
      expect(topnav).toBeTruthy()

      const links: NodeListOf<HTMLAnchorElement> = topnav.querySelectorAll('a')
      expect(links.length).toEqual(1)
    })
  })

  describe('isDarkTheme$', () => {
    it('should render the "dark_mode" material icon in the topnav when the app is in light mode', () => {
      fixture = TestBed.createComponent(AppComponent)
      component = fixture.componentInstance
      fixture.detectChanges()

      const icon: HTMLElement =
        fixture.nativeElement.querySelector('#themeIcon')

      expect(icon).toBeTruthy()
      expect(icon.textContent).toMatch('dark_mode')
    })
  })
})
