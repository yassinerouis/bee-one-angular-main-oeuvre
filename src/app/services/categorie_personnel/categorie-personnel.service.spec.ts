import { TestBed } from '@angular/core/testing';

import { CategoriePersonnelService } from './categorie-personnel.service';

describe('CategoriePersonnelService', () => {
  let service: CategoriePersonnelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriePersonnelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
