import { TestBed } from '@angular/core/testing';

import { CompositionStoreService } from './composition-store.service';

describe('CompositionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CompositionStoreService = TestBed.get(CompositionStoreService);
    expect(service).toBeTruthy();
  });
});
