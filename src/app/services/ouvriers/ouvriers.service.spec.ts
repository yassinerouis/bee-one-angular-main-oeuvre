import { TestBed } from '@angular/core/testing';

import { OuvriersService } from './ouvriers.service';

describe('OuvriersService', () => {
  let service: OuvriersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OuvriersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
