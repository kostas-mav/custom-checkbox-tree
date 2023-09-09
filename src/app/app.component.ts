import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Neat } from './shared/checkbox-tree/utils/types';
import { CheckboxTreeComponent } from './features/checkbox-tree/checkbox-tree.component';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ChipsCheckboxTreeComponent } from './features/chips-checkbox-tree/chips-checkbox-tree.component';
import { SearchCheckboxTreeComponent } from './features/search-checkbox-tree/search-checkbox-tree.component';
import { SingleCheckboxComponent } from './features/single-checkbox/single-checkbox.component';
import { SINGLE_LEVEL_DATA } from 'src/mock/single-level-data';
import { DOUBLE_LEVEL_DATA } from 'src/mock/double-level-data';
import { MULTI_LEVEL_DATA } from 'src/mock/multi-level-data';

const mockSingleOptions: Neat[] = SINGLE_LEVEL_DATA;
const mockDoubleOptions: Neat[] = DOUBLE_LEVEL_DATA;
const mockMultiOptions: Neat[] = MULTI_LEVEL_DATA;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SingleCheckboxComponent,
    CheckboxTreeComponent,
    SearchCheckboxTreeComponent,
    ChipsCheckboxTreeComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);

  form = this.fb.group({
    single: false,
    singleLevel: [[]],
    doubleLevel: [[]],
    multiLevel: [[]],
    mixedLevel: [[]],
    search: [[]],
    chips: [[]],
    parentChips: [[]],
  });

  readonly singleLevelOptions = mockSingleOptions;
  readonly doubleLevelOptions = mockDoubleOptions;
  readonly multiLevelOptions = mockMultiOptions;

  ngOnInit(): void {
    this.form.valueChanges.subscribe((v) => console.log(v));
  }
}
