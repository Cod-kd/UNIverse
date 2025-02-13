import { TestBed } from '@angular/core/testing';

import { PopupService } from './popup-message.service';

describe('PopupMessageService', () => {
  let service: PopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
