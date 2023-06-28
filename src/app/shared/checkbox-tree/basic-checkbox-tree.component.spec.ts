import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicCheckboxTreeComponent } from './basic-checkbox-tree.component';

describe('BasicCheckboxTreeComponent', () => {
  let component: BasicCheckboxTreeComponent;
  let fixture: ComponentFixture<BasicCheckboxTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BasicCheckboxTreeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicCheckboxTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
