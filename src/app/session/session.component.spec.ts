import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialogModule } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { ActivatedRouteStub } from "../../testing/activated-route-stub";
import { SessionService } from "./services/session.service";
import { SessionComponent } from "./session.component";

describe("SessionComponent", () => {
  let component: SessionComponent;
  let fixture: ComponentFixture<SessionComponent>;
  let routeStub = new ActivatedRouteStub();
  let sessionService: jasmine.SpyObj<SessionService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, SessionComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: routeStub,
        },
        {
          provide: SessionService,
          useValue: sessionService,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
