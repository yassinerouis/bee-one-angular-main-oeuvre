import { TestBed } from '@angular/core/testing';

import { FonctionPersonnelService } from './fonction-personnel.service';

describe('FonctionPersonnelService', () => {
  let service: FonctionPersonnelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FonctionPersonnelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
