import { TestBed, inject } from '@angular/core/testing';

import { ReplicationService } from './replication.service';

describe('ReplicationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReplicationService]
    });
  });

  it('should be created', inject([ReplicationService], (service: ReplicationService) => {
    expect(service).toBeTruthy();
  }));
});
