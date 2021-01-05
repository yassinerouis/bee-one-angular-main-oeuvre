import { TestBed } from '@angular/core/testing';

import { NiveauScolaireService } from './niveau-scolaire.service';

describe('NiveauScolaireService', () => {
  let service: NiveauScolaireService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NiveauScolaireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
