import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyUserComponent } from './copy-user.component';

describe('CopyUserComponent', () => {
  let component: CopyUserComponent;
  let fixture: ComponentFixture<CopyUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopyUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
