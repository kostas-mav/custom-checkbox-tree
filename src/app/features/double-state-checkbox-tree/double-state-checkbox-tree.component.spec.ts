import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoubleStateCheckboxTreeComponent } from './double-state-checkbox-tree.component';

describe('DoubleStateCheckboxTreeComponent', () => {
  let component: DoubleStateCheckboxTreeComponent;
  let fixture: ComponentFixture<DoubleStateCheckboxTreeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DoubleStateCheckboxTreeComponent]
    });
    fixture = TestBed.createComponent(DoubleStateCheckboxTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
