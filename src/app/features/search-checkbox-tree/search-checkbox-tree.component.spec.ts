import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchCheckboxTreeComponent } from './search-checkbox-tree.component';

describe('SearchCheckboxTreeComponent', () => {
  let component: SearchCheckboxTreeComponent;
  let fixture: ComponentFixture<SearchCheckboxTreeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SearchCheckboxTreeComponent]
    });
    fixture = TestBed.createComponent(SearchCheckboxTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
