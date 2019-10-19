import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AircraftComponent2Component } from './aircraft-component2.component';

describe('AircraftComponent2Component', () => {
  let component: AircraftComponent2Component;
  let fixture: ComponentFixture<AircraftComponent2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AircraftComponent2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AircraftComponent2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
