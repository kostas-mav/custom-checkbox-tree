import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripleStateCheckboxTreeComponent } from './triple-state-checkbox-tree.component';

describe('TripleStateCheckboxTreeComponent', () => {
  let component: TripleStateCheckboxTreeComponent;
  let fixture: ComponentFixture<TripleStateCheckboxTreeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TripleStateCheckboxTreeComponent]
    });
    fixture = TestBed.createComponent(TripleStateCheckboxTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
