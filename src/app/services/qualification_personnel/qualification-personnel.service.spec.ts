import { TestBed } from '@angular/core/testing';

import { QualificationPersonnelService } from './qualification-personnel.service';

describe('QualificationPersonnelService', () => {
  let service: QualificationPersonnelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QualificationPersonnelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
