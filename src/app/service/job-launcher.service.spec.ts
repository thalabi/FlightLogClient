import { TestBed, inject } from '@angular/core/testing';

import { JobLauncherService } from './job-launcher.service';

describe('JobLauncherService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JobLauncherService]
    });
  });

  it('should be created', inject([JobLauncherService], (service: JobLauncherService) => {
    expect(service).toBeTruthy();
  }));
});
