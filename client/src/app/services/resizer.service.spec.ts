import { TestBed } from '@angular/core/testing';

import { ResizerService } from './resizer.service';

describe('ResizerService', () => {
  let service: ResizerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResizerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
