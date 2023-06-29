import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { default as MockSource } from 'src/app/shared/checkbox-tree/utils/source.json';
import { Neat } from './shared/checkbox-tree/utils/types';
import { MixedStateCheckboxTreeComponent } from './features/mixed-state-checkbox-tree/mixed-state-checkbox-tree.component';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ChipsCheckboxTreeComponent } from './features/chips-checkbox-tree/chips-checkbox-tree.component';
import { DoubleStateCheckboxTreeComponent } from './features/double-state-checkbox-tree/double-state-checkbox-tree.component';
import { TripleStateCheckboxTreeComponent } from './features/triple-state-checkbox-tree/triple-state-checkbox-tree.component';
import { SearchCheckboxTreeComponent } from './features/search-checkbox-tree/search-checkbox-tree.component';
import { SingleCheckboxComponent } from './features/single-checkbox/single-checkbox.component';

const mockSource: Neat[] = MockSource;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SingleCheckboxComponent,
    DoubleStateCheckboxTreeComponent,
    TripleStateCheckboxTreeComponent,
    MixedStateCheckboxTreeComponent,
    SearchCheckboxTreeComponent,
    ChipsCheckboxTreeComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private fb = inject(NonNullableFormBuilder);

  form = this.fb.group({
    chips: [[]],
    doubleState: [[]],
    mixedState: [[]],
    search: [[]],
    single: [[]],
    tripleState: [[]],
  });

  readonly options = mockSource;
}
