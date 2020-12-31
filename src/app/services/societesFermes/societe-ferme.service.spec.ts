import { TestBed } from '@angular/core/testing';

import { SocieteFermeService } from './societe-ferme.service';

describe('SocieteFermeService', () => {
  let service: SocieteFermeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocieteFermeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
