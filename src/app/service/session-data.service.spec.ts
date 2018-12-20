import { TestBed, inject } from '@angular/core/testing';

import { SessionDataService } from './session-data.service';

describe('SessionDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SessionDataService]
    });
  });

  it('should be created', inject([SessionDataService], (service: SessionDataService) => {
    expect(service).toBeTruthy();
  }));
});
