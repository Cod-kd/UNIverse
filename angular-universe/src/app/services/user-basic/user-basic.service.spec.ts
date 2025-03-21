import { TestBed } from '@angular/core/testing';

import { UserBasicService } from './user-basic.service';

describe('UserBasicService', () => {
  let service: UserBasicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserBasicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
