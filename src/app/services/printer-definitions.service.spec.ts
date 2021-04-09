import { TestBed } from '@angular/core/testing';

import { PrinterDefinitionsService } from './printer-definitions.service';

describe('PrinterDefinitionsService', () => {
  let service: PrinterDefinitionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrinterDefinitionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
