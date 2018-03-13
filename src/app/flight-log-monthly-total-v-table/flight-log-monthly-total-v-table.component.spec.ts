import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightLogMonthlyTotalVTableComponent } from './flight-log-monthly-total-v-table.component';

describe('FlightLogMonthlyTotalVTableComponent', () => {
  let component: FlightLogMonthlyTotalVTableComponent;
  let fixture: ComponentFixture<FlightLogMonthlyTotalVTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightLogMonthlyTotalVTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightLogMonthlyTotalVTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
