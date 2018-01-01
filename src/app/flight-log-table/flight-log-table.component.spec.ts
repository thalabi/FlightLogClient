import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightLogTableComponent } from './flight-log-table.component';

describe('FlightLogTableComponent', () => {
  let component: FlightLogTableComponent;
  let fixture: ComponentFixture<FlightLogTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightLogTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightLogTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
