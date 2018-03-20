import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightLogLastXDaysTotalVTableComponent } from './flight-log-last-x-days-total-v-table.component';

describe('FlightLogLastXDaysTotalVTableComponent', () => {
  let component: FlightLogLastXDaysTotalVTableComponent;
  let fixture: ComponentFixture<FlightLogLastXDaysTotalVTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightLogLastXDaysTotalVTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightLogLastXDaysTotalVTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
