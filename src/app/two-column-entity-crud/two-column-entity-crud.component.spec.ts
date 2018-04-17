import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoColumnEntityCrudComponent } from './two-column-entity-crud.component';

describe('TwoColumnEntityCrudComponent', () => {
  let component: TwoColumnEntityCrudComponent;
  let fixture: ComponentFixture<TwoColumnEntityCrudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwoColumnEntityCrudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoColumnEntityCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
