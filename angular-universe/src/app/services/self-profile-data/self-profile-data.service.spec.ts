import { TestBed } from '@angular/core/testing';

import { SelfProfileDataService } from './self-profile-data.service';

describe('SelfProfileDataService', () => {
  let service: SelfProfileDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelfProfileDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
