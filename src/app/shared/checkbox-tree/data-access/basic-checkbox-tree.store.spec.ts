import { TestBed } from '@angular/core/testing';

import { BasicCheckboxTreeStore } from './basic-checkbox-tree.store';

describe('BasicCheckboxTreeStore', () => {
  let service: BasicCheckboxTreeStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BasicCheckboxTreeStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
