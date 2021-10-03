import { TestBed } from '@angular/core/testing';

import { ComplainService } from './complain.service';

describe('ComplainService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ComplainService = TestBed.get(ComplainService);
    expect(service).toBeTruthy();
  });
});
