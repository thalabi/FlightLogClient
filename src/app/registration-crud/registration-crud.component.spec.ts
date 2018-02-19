import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationCrudComponent } from './registration-crud.component';

describe('RegistrationCrudComponent', () => {
  let component: RegistrationCrudComponent;
  let fixture: ComponentFixture<RegistrationCrudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrationCrudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
