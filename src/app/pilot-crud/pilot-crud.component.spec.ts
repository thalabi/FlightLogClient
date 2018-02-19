import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PilotCrudComponent } from './pilot-crud.component';

describe('PilotCrudComponent', () => {
  let component: PilotCrudComponent;
  let fixture: ComponentFixture<PilotCrudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PilotCrudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PilotCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
