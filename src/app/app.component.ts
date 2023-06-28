import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { default as MockSource } from 'src/app/shared/checkbox-tree/utils/source.json';
import { Neat } from './shared/checkbox-tree/utils/types';
import { MixedStateCheckboxTreeComponent } from './features/mixed-state-checkbox-tree/mixed-state-checkbox-tree.component';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';

const mockSource: Neat[] = MockSource;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MixedStateCheckboxTreeComponent],
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
