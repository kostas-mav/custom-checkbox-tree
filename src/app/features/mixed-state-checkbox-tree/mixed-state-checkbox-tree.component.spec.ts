import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MixedStateCheckboxTreeComponent } from './mixed-state-checkbox-tree.component';

describe('MixedStateCheckboxTreeComponent', () => {
  let component: MixedStateCheckboxTreeComponent;
  let fixture: ComponentFixture<MixedStateCheckboxTreeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MixedStateCheckboxTreeComponent]
    });
    fixture = TestBed.createComponent(MixedStateCheckboxTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
