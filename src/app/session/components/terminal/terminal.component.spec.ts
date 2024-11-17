import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MetricsService, SessionService } from "../../services";
import { TerminalComponent } from "./terminal.component";

describe("TerminalComponent", () => {
  let component: TerminalComponent;
  let fixture: ComponentFixture<TerminalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerminalComponent],
      providers: [MetricsService, SessionService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
