import { TestBed } from '@angular/core/testing';

import { CancellationReasonsService } from './cancellation-reasons.service';

describe('CancellationReasonsService', () => {
  let service: CancellationReasonsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CancellationReasonsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
