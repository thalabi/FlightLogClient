import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalTestComponent } from './cal-test.component';

describe('CalTestComponent', () => {
  let component: CalTestComponent;
  let fixture: ComponentFixture<CalTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
