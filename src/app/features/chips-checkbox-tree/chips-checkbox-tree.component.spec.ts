import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChipsCheckboxTreeComponent } from './chips-checkbox-tree.component';

describe('ChipsCheckboxTreeComponent', () => {
  let component: ChipsCheckboxTreeComponent;
  let fixture: ComponentFixture<ChipsCheckboxTreeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ChipsCheckboxTreeComponent]
    });
    fixture = TestBed.createComponent(ChipsCheckboxTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
