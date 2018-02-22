import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestArraySortComponent } from './test-array-sort.component';

describe('TestArraySortComponent', () => {
  let component: TestArraySortComponent;
  let fixture: ComponentFixture<TestArraySortComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestArraySortComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestArraySortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
