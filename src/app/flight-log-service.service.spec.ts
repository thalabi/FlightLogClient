import { TestBed, inject } from '@angular/core/testing';

import { FlightLogServiceService } from './flight-log-service.service';

describe('FlightLogServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FlightLogServiceService]
    });
  });

  it('should be created', inject([FlightLogServiceService], (service: FlightLogServiceService) => {
    expect(service).toBeTruthy();
  }));
});
