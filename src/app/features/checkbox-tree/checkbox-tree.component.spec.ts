import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxTreeComponent } from './checkbox-tree.component';

describe('CheckboxTreeComponent', () => {
  let component: CheckboxTreeComponent;
  let fixture: ComponentFixture<CheckboxTreeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CheckboxTreeComponent],
    });
    fixture = TestBed.createComponent(CheckboxTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
