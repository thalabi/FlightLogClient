import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeModelCrudComponent } from './make-model-crud.component';

describe('MakeModelCrudComponent', () => {
  let component: MakeModelCrudComponent;
  let fixture: ComponentFixture<MakeModelCrudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakeModelCrudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeModelCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
