import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AircraftComponentComponent } from './aircraft-component.component';

describe('AircraftComponentComponent', () => {
  let component: AircraftComponentComponent;
  let fixture: ComponentFixture<AircraftComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AircraftComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AircraftComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
