import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobLauncherComponent } from './job-launcher.component';

describe('JobLauncherComponent', () => {
  let component: JobLauncherComponent;
  let fixture: ComponentFixture<JobLauncherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobLauncherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobLauncherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
