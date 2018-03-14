import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightLogYearlyTotalVTableComponent } from './flight-log-yearly-total-v-table.component';

describe('FlightLogYearlyTotalVTableComponent', () => {
  let component: FlightLogYearlyTotalVTableComponent;
  let fixture: ComponentFixture<FlightLogYearlyTotalVTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightLogYearlyTotalVTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightLogYearlyTotalVTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
