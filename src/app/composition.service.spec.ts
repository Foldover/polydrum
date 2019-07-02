import { TestBed } from '@angular/core/testing';

import { CompositionService } from './composition.service';

describe('CompositionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CompositionService = TestBed.get(CompositionService);
    expect(service).toBeTruthy();
  });
});
