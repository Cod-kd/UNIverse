import { TestBed } from '@angular/core/testing';

import { CardMetadataService } from './card-meta-data.service';

describe('CardMetaDataService', () => {
  let service: CardMetadataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardMetadataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
