import { TestBed } from '@angular/core/testing';

import { ParametrageAmcService } from './parametrage-amc.service';

describe('ParametrageAmcService', () => {
  let service: ParametrageAmcService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParametrageAmcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
