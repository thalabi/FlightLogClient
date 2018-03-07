import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleColumnEntityCrudComponent } from './single-column-entity-crud.component';

describe('TestArraySortComponent', () => {
  let component: SingleColumnEntityCrudComponent;
  let fixture: ComponentFixture<SingleColumnEntityCrudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleColumnEntityCrudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleColumnEntityCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
