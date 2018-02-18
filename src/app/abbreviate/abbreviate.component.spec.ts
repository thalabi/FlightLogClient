import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbbreviateComponent } from './abbreviate.component';

describe('AbbreviateComponent', () => {
  let component: AbbreviateComponent;
  let fixture: ComponentFixture<AbbreviateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbbreviateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbbreviateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
