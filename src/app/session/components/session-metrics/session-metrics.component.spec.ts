import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionMetricsComponent } from './session-metrics.component';

describe('SessionMetricsComponent', () => {
  let component: SessionMetricsComponent;
  let fixture: ComponentFixture<SessionMetricsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SessionMetricsComponent]
    });
    fixture = TestBed.createComponent(SessionMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
