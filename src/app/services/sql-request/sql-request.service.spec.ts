import { TestBed } from '@angular/core/testing';

import { SqlRequestService } from './sql-request.service';

describe('SqlRequestService', () => {
  let service: SqlRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SqlRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
