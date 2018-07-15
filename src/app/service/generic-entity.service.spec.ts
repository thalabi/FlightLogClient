import { TestBed, inject } from '@angular/core/testing';

import { GenericEntityService } from './generic-entity.service';

describe('GenericEntityService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GenericEntityService]
    });
  });

  it('should be created', inject([GenericEntityService], (service: GenericEntityService) => {
    expect(service).toBeTruthy();
  }));
});
